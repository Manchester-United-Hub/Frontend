import type { RosterView } from '@features/player/model';
import { ViewToggle } from './ViewToggle';

interface ResultRowProps {
  count: number;
  page: number;
  totalPages: number;
  view: RosterView;
  onViewChange: (view: RosterView) => void;
}

/**
 * 결과 카운트 + 페이지 위치 + 뷰 토글 행. players.css `.result-row`: flex space-between + wrap.
 * `N`은 united-red로 강조(`.result-count b`). 카운트는 현재 페이지가 아니라 필터를 통과한
 * 전체 결과 수다 — 페이지 위치는 뒤에 "n/m 페이지"로 따로 붙는다(시안 `.result-count`).
 */
function ResultRow({ count, page, totalPages, view, onViewChange }: ResultRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 pb-4.5">
      <p className="text-[15px] text-muted-foreground">
        총 <span className="text-[18px] font-extrabold text-united-red">{count}</span>명의
        선수를 찾았습니다 · {page}/{totalPages} 페이지
      </p>
      <ViewToggle value={view} onChange={onViewChange} />
    </div>
  );
}

export { ResultRow, type ResultRowProps };
