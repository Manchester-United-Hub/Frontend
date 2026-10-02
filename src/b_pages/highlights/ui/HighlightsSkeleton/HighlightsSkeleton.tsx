import { PAGE_SIZE } from '@pages/highlights/model';
import { Skeleton } from '@shared/ui';

import { HIGHLIGHTS_GRID_CLASSNAME } from '../HighlightsGrid';

export interface HighlightsSkeletonProps {
  /** 렌더할 스켈레톤 카드 개수. 미지정 시 한 페이지 분량(PAGE_SIZE)을 사용한다. */
  count?: number;
}

/**
 * 최초 로딩 스켈레톤 — HighlightsGrid와 동일 그리드 폭 공유, HighlightCard 레이아웃(썸네일·제목·
 * 대회·메타 2개) 미러. 전체 aria-hidden(스크린리더에 로딩 placeholder 노출 안 함).
 * 개별 Skeleton은 motion-safe:animate-pulse를 이미 내장한다(@shared/ui).
 */
function HighlightsSkeleton({ count = PAGE_SIZE }: HighlightsSkeletonProps) {
  return (
    <div aria-hidden="true" className={HIGHLIGHTS_GRID_CLASSNAME}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Skeleton className="aspect-video rounded-none" />
          <div className="flex flex-col gap-2 px-4 pb-4 pt-3.5">
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-3 w-[40%]" />
            <div className="mt-2 flex gap-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { HighlightsSkeleton };
