import { Fragment } from 'react';

import { Skeleton } from '@shared/ui';

const SKELETON_ROW_COUNT = 5;
const SKELETON_ARIA_LABEL = '경기 일정을 불러오는 중';

/**
 * MatchesSkeleton 자리표시자 1행 — MatchRow의 6열/4열(≤980px) 그리드 형태를
 * Skeleton 블록으로 흉내낸다(D-13 — 전담 퍼블리셔 미투입, fe-engineer가 직접 구현).
 * 정적이므로 모듈 스코프 상수로 호이스팅(code-conventions §6 — 파일당 1컴포넌트).
 */
const SKEL_ROW = (
  <div
    data-testid="matches-skeleton-row"
    className="grid min-h-[66px] grid-cols-[86px_122px_1fr_92px_1fr_132px] items-center gap-3.5 border-b border-border px-4.5 py-3 max-[980px]:grid-cols-[72px_1fr_88px_1fr]"
  >
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-10" />
      <Skeleton className="h-3 w-6" />
    </div>

    <div className="flex flex-col gap-1.5 max-[980px]:hidden">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-8" />
    </div>

    <div className="flex items-center justify-end gap-2">
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-[30px] w-[30px] rounded-full" />
    </div>

    <div className="flex flex-col items-center gap-1.5">
      <Skeleton className="h-5 w-10" />
      <Skeleton className="h-3 w-8" />
    </div>

    <div className="flex items-center justify-start gap-2">
      <Skeleton className="h-[30px] w-[30px] rounded-full" />
      <Skeleton className="h-3.5 w-20" />
    </div>

    <div className="flex items-center gap-1.5 max-[980px]:hidden">
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

/**
 * MatchesSkeleton — MatchesTab 로딩 상태. SKELETON_ROW_COUNT개의 MatchRow
 * 형태 자리표시자를 렌더한다. role="status"·aria-live="polite"로 스크린리더에
 * 로딩 중임을 알리고, 실제로 읽힐 텍스트(sr-only)를 안에 둔다 — aria-label은
 * 영역의 "이름"일 뿐 live region 알림의 "내용"이 아니다. 시각적 자리표시자는
 * aria-hidden 래퍼로 감싸 접근성 트리에서 제외한다.
 */
export function MatchesSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-label={SKELETON_ARIA_LABEL}>
      <span className="sr-only">{SKELETON_ARIA_LABEL}</span>
      <div aria-hidden>
        {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
          <Fragment key={index}>{SKEL_ROW}</Fragment>
        ))}
      </div>
    </div>
  );
}

export { SKELETON_ROW_COUNT };
