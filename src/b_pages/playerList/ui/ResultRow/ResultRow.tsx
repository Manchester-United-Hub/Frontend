import type { RosterView } from '../../model/types';
import { ViewToggle } from './ViewToggle';

interface ResultRowProps {
  count: number;
  view: RosterView;
  onViewChange: (view: RosterView) => void;
}

/**
 * 결과 카운트 + 뷰 토글 행. players.css `.result-row`: flex space-between + wrap.
 * `N`은 united-red로 강조(`.result-count b`).
 */
function ResultRow({ count, view, onViewChange }: ResultRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 pb-4.5">
      <p className="text-[15px] text-muted-foreground">
        총 <span className="text-[18px] font-extrabold text-united-red">{count}</span>명의
        선수를 찾았습니다
      </p>
      <ViewToggle value={view} onChange={onViewChange} />
    </div>
  );
}

export { ResultRow, type ResultRowProps };
