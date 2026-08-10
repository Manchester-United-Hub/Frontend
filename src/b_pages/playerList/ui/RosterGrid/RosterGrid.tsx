import { PlayerCard } from '@shared/ui';

import { FLAG_EMOJI } from '../../model/flagEmoji';
import { playerDetailHref } from '../../model/playerDetailHref';
import type { PlayerListItem } from '../../model/types';

/**
 * 카드뷰 반응형 그리드 — standards: 5 → (≤1100) 4 → (≤980) 3 → (≤620) 2열.
 * RosterSkeleton이 로딩 상태에서 동일 폭을 유지하도록 이 클래스를 재노출해 공유한다.
 */
const ROSTER_GRID_CLASSNAME =
  'grid grid-cols-5 gap-4 max-[1100px]:grid-cols-4 max-[980px]:grid-cols-3 max-[620px]:grid-cols-2';

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
            // flag 슬롯 자체는 항상 렌더한다 — PlayerCard의 hasNationality가 flag 유무로
            // 국적 행 전체를 게이트하므로(f_shared, 수정 금지), slot을 undefined로 비우면
            // 글리프가 없는 flagCode:undefined 선수(전원)의 국적이 카드뷰에서 통째로 사라진다
            // (리뷰 H-2). 글리프만 조건부로 비운다.
            flag={<span aria-hidden="true">{player.flagCode ? FLAG_EMOJI[player.flagCode] : ''}</span>}
            href={playerDetailHref(player.id)}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}

export { RosterGrid, ROSTER_GRID_CLASSNAME, type RosterGridProps };
