'use client';

import { Clapperboard } from 'lucide-react';

import { FEATURED_LABELS, type UseHighlightsResult } from '@pages/highlights/model';
import { StateBox } from '@shared/ui';

import { FeaturedHighlight } from '../FeaturedHighlight';
import { HighlightsErrorState } from '../HighlightsErrorState';
import { HighlightsFilterBar } from '../HighlightsFilterBar';
import { HighlightsGrid } from '../HighlightsGrid';
import { HighlightsPager } from '../HighlightsPager';
import { HighlightsSkeleton } from '../HighlightsSkeleton';

interface HighlightsContentProps extends UseHighlightsResult {
  showFeatured?: boolean;
}

function HighlightsContent({
  isLoading,
  isError,
  refetch,
  sortKey,
  changeSort,
  featured,
  pageItems,
  totalCount,
  page,
  totalPages,
  goToPage,
  showFeatured = true,
}: HighlightsContentProps) {
  if (isLoading) return <HighlightsSkeleton />;
  if (isError) return <HighlightsErrorState onRetry={refetch} />;

  const visibleFeatured = showFeatured ? featured : undefined;

  if (!visibleFeatured && totalCount === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border">
        <StateBox
          className="py-[72px]"
          variant="empty"
          icon={<Clapperboard size={24} aria-hidden="true" />}
          title="아직 등록된 하이라이트가 없어요"
          description="경기가 끝나면 하이라이트가 올라와요."
        />
      </div>
    );
  }

  // 페이지를 넘기면 바뀐 목록이 처음부터 보이도록 맨 위로 올린다.
  const handlePageChange = (nextPage: number) => {
    goToPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <HighlightsFilterBar
        sortKey={sortKey}
        onSortChange={changeSort}
      />

      <p className="pb-4 text-sm text-muted-foreground">
        <b className="font-semibold text-foreground">{totalCount}</b>개의 영상
      </p>

      {visibleFeatured ? (
        <FeaturedHighlight
          title={visibleFeatured.title}
          label={FEATURED_LABELS[sortKey]}
          thumbnailUrl={visibleFeatured.thumbnailUrl}
          date={visibleFeatured.date}
          views={visibleFeatured.views}
          watchUrl={visibleFeatured.watchUrl}
          className="mb-6"
        />
      ) : null}

      {pageItems.length > 0 ? <HighlightsGrid items={pageItems} /> : null}

      {totalPages > 1 ? (
        <HighlightsPager
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      ) : null}
    </>
  );
}

export { HighlightsContent };
export type { HighlightsContentProps };
