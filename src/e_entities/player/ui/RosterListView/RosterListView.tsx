import { cn } from '@shared/utils';

import type { PlayerListItem } from '../../model/playerListItem';
import { RosterListRow } from './RosterListRow';

/**
 * 리스트뷰 헤더/행 공유 그리드 템플릿 — standards: ≤980px 국적 컬럼 숨김, ≤620px 포지션 숨김.
 * 원본 시안(players.css .rl-head/.rl-row)의 브레이크포인트별 트랙 수가 숨겨지는 컬럼 수와
 * 어긋나 있어(preview 전용 코드), 실제로 남는 컬럼 수에 맞춰 트랙을 재계산했다 — 숨김 대상
 * 컬럼(국적 @980 / 포지션 @620)은 표준 그대로 따른다.
 */
const ROSTER_ROW_GRID_CLASSNAME = cn(
  'grid grid-cols-[54px_1fr_90px_1fr_130px_110px] items-center gap-3 px-4.5',
  'max-[980px]:grid-cols-[44px_1fr_70px_110px_100px]',
  'max-[620px]:grid-cols-[40px_1fr_100px_90px]',
);

interface RosterListViewProps {
  players: PlayerListItem[];
}

/** 결과 리스트뷰 — 헤더 행 + RosterListRow(행 전체 Link). */
function RosterListView({ players }: RosterListViewProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div
        className={cn(
          ROSTER_ROW_GRID_CLASSNAME,
          'h-11 border-b border-border bg-muted text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground',
        )}
      >
        <span className="text-center">번호</span>
        <span>선수</span>
        <span className="max-[620px]:hidden">포지션</span>
        <span className="max-[980px]:hidden">국적</span>
        <span>활약연도</span>
        <span>상태</span>
      </div>
      <ul role="list">
        {players.map((player) => (
          <li key={player.id}>
            <RosterListRow player={player} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export { RosterListView, ROSTER_ROW_GRID_CLASSNAME, type RosterListViewProps };
