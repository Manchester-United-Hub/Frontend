import { Skeleton } from '@shared/ui';

/** 팀·스코어 영역 — 정적이므로 모듈 스코프에 호이스팅 */
const SKEL_BODY = (
  <div className="mt-5.5 mb-4.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-11 w-11 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
    <Skeleton className="h-7 w-14" />
    <div className="flex flex-col items-center gap-2">
      <Skeleton className="h-11 w-11 rounded-full" />
      <Skeleton className="h-3 w-14" />
    </div>
  </div>
);

/** 로딩 중 MatchCard 형태 자리 표시자 */
export function MatchCardSkeleton() {
  return (
    <div
      className="rounded-lg border border-border bg-card p-5.5 shadow-sm"
      aria-hidden
    >
      <Skeleton className="h-3.5 w-24" />
      {SKEL_BODY}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
