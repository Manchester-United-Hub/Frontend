import type { UseHighlightsResult } from '@pages/highlights/model';

import { FeaturedHighlight } from '../FeaturedHighlight';
import { HighlightsFilterBar } from '../HighlightsFilterBar';
import { HighlightsGrid } from '../HighlightsGrid';
import { HighlightsPager } from '../HighlightsPager';
import { HighlightsSkeleton } from '../HighlightsSkeleton';

export interface HighlightsContentProps extends UseHighlightsResult {
  /** 대표 영상 노출 여부(AD-6). 기본 true. false면 featured가 있어도 렌더하지 않는다. */
  showFeatured?: boolean;
}

/**
 * 하이라이트 콘텐츠 영역 — 로딩 → 필터 바 + 결과 개수 + (대표 영상) + 그리드 + 페이저 3단 분기.
 * useHighlights(ST-2)의 상태·핸들러를 props로 그대로 수취하는 표현 전용 조립 컴포넌트(NewsContent 미러).
 */
function HighlightsContent({
  isLoading,
  category,
  changeCategory,
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

  return (
    <>
      <HighlightsFilterBar
        category={category}
        onCategoryChange={changeCategory}
        sortKey={sortKey}
        onSortChange={changeSort}
      />

      <p className="pb-4 text-sm text-muted-foreground">
        <b className="font-semibold text-foreground">{totalCount}</b>개의 영상
      </p>

      {showFeatured && featured ? (
        <FeaturedHighlight
          title={featured.title}
          category={featured.category}
          competition={featured.competition}
          date={featured.date}
          views={featured.views}
          duration={featured.duration}
          description={featured.description ?? ''}
          className="mb-6"
        />
      ) : null}

      <HighlightsGrid items={pageItems} />

      {totalPages > 1 ? (
        <HighlightsPager
          currentPage={page}
          totalPages={totalPages}
          onPageChange={goToPage}
          className="mt-8"
        />
      ) : null}
    </>
  );
}

export { HighlightsContent };
