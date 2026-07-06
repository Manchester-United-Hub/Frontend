import { Skeleton } from '@shared/ui';

import { NEWS_GRID_CLASSNAME } from '../NewsGrid';

/** 스켈레톤 카드 기본 개수 — 데이터가 아니라 표시용 기본값이므로 컴포넌트가 소유한다. */
export const DEFAULT_NEWS_SKELETON_COUNT = 6;

export interface NewsSkeletonProps {
  /** 렌더할 스켈레톤 카드 개수. 미지정 시 기본값을 사용한다. */
  count?: number;
}

/** 최초 로딩 스켈레톤 — NewsGrid와 동일 그리드 폭 공유, 전체 aria-hidden. */
function NewsSkeleton({ count = DEFAULT_NEWS_SKELETON_COUNT }: NewsSkeletonProps) {
  return (
    <div aria-hidden="true" className={NEWS_GRID_CLASSNAME}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border border-border bg-card">
          <Skeleton className="aspect-video rounded-none" />
          <div className="flex flex-col gap-2 px-[18px] pb-[18px] pt-4">
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="h-3 w-[70%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { NewsSkeleton };
