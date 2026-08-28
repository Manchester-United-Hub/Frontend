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
            // flag 슬롯 자체는 항상 렌더한다 — PlayerCard의 hasNationality가 flag 유무로
            // 국적 행 전체를 게이트하므로(f_shared, 수정 금지), slot을 undefined로 비우면
            // 글리프가 없는 flagCode:undefined 선수(전원)의 국적이 카드뷰에서 통째로 사라진다
            // (리뷰 H-2). 글리프만 조건부로 비운다.
            flag={<span aria-hidden="true">{player.flagCode ? FLAG_EMOJI[player.flagCode] : ''}</span>}
            // photo가 없거나 빈 문자열이면 slot을 아예 넘기지 않는다 — PlayerCard(f_shared,
            // 수정 금지)의 `photo ?? <Silhouette />` 폴백이 그대로 유지되게 하기 위함(D-9).
            // 단 이는 photo 부재 경로에만 해당한다. 로드 실패 경로는 slot 값이 이미 엘리먼트라
            // PlayerCard 폴백에 도달하지 않으며, RosterCardPhoto가 자기 폴백을 렌더한다(D-15).
            photo={player.photo ? <RosterCardPhoto src={player.photo} /> : undefined}
            href={playerDetailHref(player.id)}
            className="h-full"
          />
        </li>
      ))}
    </ul>
  );
}

export { RosterGrid, ROSTER_GRID_CLASSNAME, type RosterGridProps };
