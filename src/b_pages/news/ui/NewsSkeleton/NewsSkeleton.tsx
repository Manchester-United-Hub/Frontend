import { Skeleton } from '@shared/ui';

import { ROW_LAYOUT_CLASSNAME } from '../NewsRow';
import { NEWS_LIST_CLASSNAME } from '../NewsList';

/** 스켈레톤 로우 기본 개수 — 데이터가 아니라 표시용 기본값이므로 컴포넌트가 소유한다. */
export const DEFAULT_NEWS_SKELETON_COUNT = 6;

export interface NewsSkeletonProps {
  /** 렌더할 스켈레톤 로우 개수. 미지정 시 기본값을 사용한다. */
  count?: number;
}

/** 최초 로딩 스켈레톤 — NewsList와 동일 레이아웃 폭 공유, 전체 aria-hidden. */
function NewsSkeleton({ count = DEFAULT_NEWS_SKELETON_COUNT }: NewsSkeletonProps) {
  return (
    <div aria-hidden="true" className={NEWS_LIST_CLASSNAME}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={ROW_LAYOUT_CLASSNAME}>
          <Skeleton className="h-3 w-[110px]" />
          <Skeleton className="h-5 w-[70%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[55%]" />
        </div>
      ))}
    </div>
  );
}

export { NewsSkeleton };
