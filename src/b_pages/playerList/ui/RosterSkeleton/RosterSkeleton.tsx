import { Skeleton } from '@shared/ui';

import { SKELETON_CARD_COUNT } from '../../model/mockData';
import { ROSTER_GRID_CLASSNAME } from '../RosterGrid';

/** 새로고침 로딩 스켈레톤 — RosterGrid와 동일 그리드 폭 공유, 전체 aria-hidden(ADR-8). */
function RosterSkeleton() {
  return (
    <div aria-hidden="true" className={ROSTER_GRID_CLASSNAME}>
      {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
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
