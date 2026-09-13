import { PlayerCard } from '@shared/ui';

import { FLAG_EMOJI } from '../../model/flagEmoji';
import { playerDetailHref } from '../../model/playerDetailHref';
import type { PlayerListItem } from '../../model/playerListItem';
import { RosterCardPhoto } from './RosterCardPhoto';

/**
 * 카드뷰 반응형 그리드 — standards: 2 → (≥620) 3 → (≥980) 4 → (≥1100) 5열.
 * RosterSkeleton이 로딩 상태에서 동일 폭을 유지하도록 이 클래스를 재노출해 공유한다.
 * 모바일 퍼스트(min-width)로 useRosterPageSize와 경계 의미론을 통일한다 — 둘 중 하나만
 * 부정형(Tailwind의 max-width 변형) max width 계열로 되돌리면 경계 1px에서 잘린 행이
 * 생긴다(D-11, decision-1.md).
 */
const ROSTER_GRID_CLASSNAME =
  'grid grid-cols-2 gap-4 min-[620px]:grid-cols-3 min-[980px]:grid-cols-4 min-[1100px]:grid-cols-5';

interface RosterGridProps {
  players: PlayerListItem[];
}

/** 결과 카드뷰 — PlayerCard(ST-1 확장판) 소비. ADR-4(flag 슬롯)·ADR-5(선수별 href) 반영. */
function RosterGrid({ players }: RosterGridProps) {
  return (
    <ul role="list" className={ROSTER_GRID_CLASSNAME}>
      {players.map((player) => (
        <li key={player.id}>
          <PlayerCard
            name={player.name}
            nameEn={player.nameEn}
            position={player.position ?? '-'}
            status={player.status}
            meta={player.years}
            number={player.number}
            nationality={player.nationality}
            flag={
              <span aria-hidden="true">
                {player.flagCode ? FLAG_EMOJI[player.flagCode] : ''}
              </span>
            }
            photo={
              player.photo ? <RosterCardPhoto src={player.photo} /> : undefined
            }
            href={playerDetailHref(player.id)}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}

export { RosterGrid, ROSTER_GRID_CLASSNAME, type RosterGridProps };
