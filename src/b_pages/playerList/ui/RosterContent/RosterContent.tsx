import type { PlayerListItem, RosterView } from '../../model';
import { RosterEmpty } from '../RosterEmpty';
import { RosterGrid } from '../RosterGrid';
import { RosterListView } from '../RosterListView';
import { RosterSkeleton } from '../RosterSkeleton';

export interface RosterContentProps {
  isLoading: boolean;
  results: PlayerListItem[];
  view: RosterView;
  onReset: () => void;
}

/** 로딩 → 0건 → 뷰(card/list) 3단 분기 렌더 영역. */
function RosterContent({ isLoading, results, view, onReset }: RosterContentProps) {
  if (isLoading) return <RosterSkeleton />;
  if (results.length === 0) return <RosterEmpty onReset={onReset} />;
  return view === 'card' ? (
    <RosterGrid players={results} />
  ) : (
    <RosterListView players={results} />
  );
}

export { RosterContent };
