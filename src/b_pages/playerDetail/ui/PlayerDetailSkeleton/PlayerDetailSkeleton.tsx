import { Shell, Skeleton } from '@shared/ui';

/* 정적 JSX(props·state 비의존) — 모듈 스코프 호이스팅, code-conventions §2 */

const SKELETON_HEADER = (
  <div className="grid grid-cols-1 items-start gap-5 pb-2 pt-5 min-[980px]:grid-cols-[280px_1fr] min-[980px]:gap-8">
    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
    <div>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-3 h-9 w-64" />
      <Skeleton className="mt-2 h-4 w-40" />
      <div className="mt-3.5 flex gap-2">
        <Skeleton className="h-[22px] w-20 rounded-md" />
        <Skeleton className="h-[22px] w-24 rounded-md" />
        <Skeleton className="h-[22px] w-16 rounded-md" />
      </div>
      <Skeleton className="mt-[22px] h-[168px] w-full rounded-lg" />
    </div>
  </div>
);

const SKELETON_STAT_CARDS = (
  <div className="grid grid-cols-2 gap-3.5 min-[620px]:grid-cols-4">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="rounded-lg border border-border bg-card p-[18px]">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="mt-2.5 h-8 w-14" />
        <Skeleton className="mt-2 h-3.5 w-20" />
      </div>
    ))}
  </div>
);

const SKELETON_CARD_BLOCK = (
  <div className="mt-[22px] rounded-lg border border-border bg-card p-5">
    <Skeleton className="h-4 w-40" />
    <div className="mt-5 grid grid-cols-1 items-center gap-8 max-[680px]:justify-items-center min-[680px]:grid-cols-[280px_1fr]">
      <Skeleton className="h-[220px] w-[220px] rounded-full" />
      <div className="w-full space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-3.5 w-full" />
        ))}
      </div>
    </div>
  </div>
);

const SKELETON_TABLE = (
  <div className="mt-[26px] overflow-hidden rounded-lg border border-border">
    <Skeleton className="h-11 w-full rounded-none" />
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="flex gap-4 border-t border-border px-4 py-3">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-10" />
        <Skeleton className="h-3.5 w-10" />
      </div>
    ))}
  </div>
);

/**
 * 선수 상세 페이지 로딩 스켈레톤 — pd-head(사진+정보그리드) + 통산 스탯 카드
 * + 능력치/현재시즌 카드 형태 2개 + 시즌표 영역을 f_shared Skeleton으로 조합한다.
 * props 없음(app/players/[playerId]/loading.tsx가 그대로 렌더).
 */
export function PlayerDetailSkeleton() {
  return (
    <main aria-hidden="true">
      <Shell className="pb-16">
        <Skeleton className="mt-5 h-4 w-24" />
        {SKELETON_HEADER}
        {SKELETON_STAT_CARDS}
        {SKELETON_CARD_BLOCK}
        {SKELETON_CARD_BLOCK}
        {SKELETON_TABLE}
      </Shell>
    </main>
  );
}
