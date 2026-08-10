import type { PlayerListItem, RosterView } from '../../model';
import { RosterEmpty } from '../RosterEmpty';
import { RosterErrorState } from '../RosterErrorState';
import { RosterGrid } from '../RosterGrid';
import { RosterListView } from '../RosterListView';
import { RosterSkeleton } from '../RosterSkeleton';

export interface RosterContentProps {
  isLoading: boolean;
  isError?: boolean;
  results: PlayerListItem[];
  view: RosterView;
  onReset: () => void;
  /** 에러 상태에서 "다시 시도" 액션. 미지정 시 RosterErrorState가 액션 버튼을 렌더하지 않는다. */
  onRetry?: () => void;
}

/** 로딩 → 에러 → 0건 → 뷰(card/list) 4단 분기 렌더 영역. */
function RosterContent({
  isLoading,
  isError = false,
  results,
  view,
  onReset,
  onRetry,
}: RosterContentProps) {
  if (isLoading) return <RosterSkeleton />;
  if (isError) return <RosterErrorState onRetry={onRetry} />;
  if (results.length === 0) return <RosterEmpty onReset={onReset} />;
  return view === 'card' ? (
    <RosterGrid players={results} />
  ) : (
    <RosterListView players={results} />
  );
}

export { RosterContent };
