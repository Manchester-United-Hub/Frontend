import type { PlayerListItem } from '@entities/player/model';
import { RosterGrid, RosterListView } from '@entities/player/ui';
import type { RosterView } from '@features/player/model';
import { RosterEmpty, RosterErrorState, RosterPager } from '@features/player/ui';
import { RosterSkeleton } from '../RosterSkeleton';

export interface RosterPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface RosterContentProps {
  isLoading: boolean;
  isError?: boolean;
  /** 현재 페이지에 보일 선수들 — 전체 결과가 아니라 페이지 조각이다. */
  results: PlayerListItem[];
  view: RosterView;
  onReset: () => void;
  /** 에러 상태에서 "다시 시도" 액션. 미지정 시 RosterErrorState가 액션 버튼을 렌더하지 않는다. */
  onRetry?: () => void;
  /** 미지정 시 페이저를 렌더하지 않는다(페이지네이션이 없는 소비처용). */
  pagination?: RosterPagination;
  /** 로딩 스켈레톤 카드 수. 미지정 시 RosterSkeleton 기본값(DEFAULT_SKELETON_CARD_COUNT)을 쓴다(S-14). */
  skeletonCount?: number;
}

/**
 * 로딩 → 에러 → 0건 → 뷰(card/list) 4단 분기 렌더 영역.
 * 페이저는 결과가 실제로 보이는 분기에서만 따라 렌더된다(로딩·에러·0건에는 없다).
 */
function RosterContent({
  isLoading,
  isError = false,
  results,
  view,
  onReset,
  onRetry,
  pagination,
  skeletonCount,
}: RosterContentProps) {
  if (isLoading) return <RosterSkeleton count={skeletonCount} />;
  if (isError) return <RosterErrorState onRetry={onRetry} />;
  if (results.length === 0) return <RosterEmpty onReset={onReset} />;

  return (
    <>
      {view === 'card' ? (
        <RosterGrid players={results} />
      ) : (
        <RosterListView players={results} />
      )}
      {pagination ? <RosterPager {...pagination} /> : null}
    </>
  );
}

export { RosterContent };
