import { Skeleton } from '@shared/ui';

/** 카드 하단 텍스트 영역 — 정적이므로 모듈 스코프에 호이스팅 */
const SKEL_BODY = (
  <div className="px-3.5 pb-4 pt-3.5">
    <Skeleton className="h-4 w-3/5" />
    <Skeleton className="mt-2 h-3 w-2/5" />
    <Skeleton className="mt-2.5 h-3 w-1/3" />
  </div>
);

/** 로딩 중 PlayerCard 형태 자리 표시자 */
export function PlayerCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-border bg-card"
      aria-hidden
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      {SKEL_BODY}
    </div>
  );
}
