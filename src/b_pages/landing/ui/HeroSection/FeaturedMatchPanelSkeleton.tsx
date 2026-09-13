import { Skeleton } from '@shared/ui';
import { cn } from '@shared/utils';

/** 상단 competition 라벨 + '다음 경기' 배지 자리 — 정적이므로 모듈 스코프에 호이스팅 */
const SKEL_TOP = (
  <div className="flex items-center justify-between">
    <Skeleton className="h-3.5 w-28" />
    <Skeleton className="h-[22px] w-24 rounded-md" />
  </div>
);

/** 팀 3열 그리드(홈 엠블럼·이름 / VS / 원정 엠블럼·이름) — 정적이므로 모듈 스코프에 호이스팅 */
const SKEL_TEAMS = (
  <div className="my-7 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
    <div className="flex flex-col items-center gap-2.5">
      <Skeleton className="h-14 w-14 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
    <Skeleton className="h-6 w-7" />
    <div className="flex flex-col items-center gap-2.5">
      <Skeleton className="h-14 w-14 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
  </div>
);

/** venue·시간 메타 행 — 정적이므로 모듈 스코프에 호이스팅 */
const SKEL_META = (
  <div className="flex items-center justify-center gap-[18px] border-b border-t border-[#27272a] py-3.5">
    <Skeleton className="h-3.5 w-24" />
    <Skeleton className="h-3.5 w-32" />
  </div>
);

export interface FeaturedMatchPanelSkeletonProps {
  className?: string;
}

/** 로딩 중 FeaturedMatchPanel 형태 자리 표시자 */
export function FeaturedMatchPanelSkeleton({ className }: FeaturedMatchPanelSkeletonProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl border border-[#27272a] p-6 shadow-md', className)}
      style={{ backgroundColor: 'var(--footer-bg)' }}
      aria-hidden
    >
      {SKEL_TOP}
      {SKEL_TEAMS}
      {SKEL_META}
      <div className="relative z-10 mt-[18px] flex gap-2.5">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
