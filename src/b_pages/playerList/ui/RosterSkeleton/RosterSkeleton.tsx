import { Skeleton } from '@shared/ui';

import { ROSTER_GRID_CLASSNAME } from '../RosterGrid';

/**
 * 스켈레톤 카드 기본 개수. API 연결 시 실제 응답 개수를 미리 알 수 없으므로,
 * 데이터(mockData)가 아니라 스켈레톤 컴포넌트가 표시용 기본값을 소유한다.
 */
export const DEFAULT_SKELETON_CARD_COUNT = 10;

export interface RosterSkeletonProps {
  /** 렌더할 스켈레톤 카드 개수. 미지정 시 기본값을 사용한다. */
  count?: number;
}

/** 새로고침 로딩 스켈레톤 — RosterGrid와 동일 그리드 폭 공유, 전체 aria-hidden(ADR-8). */
function RosterSkeleton({ count = DEFAULT_SKELETON_CARD_COUNT }: RosterSkeletonProps) {
  return (
    <div aria-hidden="true" className={ROSTER_GRID_CLASSNAME}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Skeleton className="aspect-square rounded-none" />
          <div className="flex flex-col gap-2 p-3.5">
            <Skeleton className="h-3.5 w-[70%]" />
            <Skeleton className="h-2.5 w-[45%]" />
            <Skeleton className="h-2.5 w-[60%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export { RosterSkeleton };
