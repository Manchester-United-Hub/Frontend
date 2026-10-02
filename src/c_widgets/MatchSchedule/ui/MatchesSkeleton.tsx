import { Fragment } from 'react';

import { FILTER_ROW_CLASS, matchesPanelHead } from '@features/matches/model';
import { PANEL_SHELL_CLASS, PanelHead, Shell, Skeleton } from '@shared/ui';

const SKELETON_ROW_COUNT = 5;
const SKELETON_ARIA_LABEL = '경기 일정을 불러오는 중';
const FILTER_LABEL_LINE_H = '24px';

const SKEL_FILTER_ROW = (
  <div className={FILTER_ROW_CLASS}>
    <div className="flex flex-col gap-1.5">
      <div className="flex h-6 items-center">
        <Skeleton className="h-3 w-14" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-8 w-13 rounded-full" />
        <Skeleton className="h-8 w-11 rounded-full" />
        <Skeleton className="h-8 w-13 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * MatchesSkeleton 자리표시자 1행 — MatchRow의 6열/4열(≤980px) 그리드 형태를
 */
const SKEL_ROW = (
  <div
    data-testid="matches-skeleton-row"
    className="grid min-h-16.5 grid-cols-[86px_122px_1fr_92px_1fr_132px] items-center gap-3.5 border-b border-border px-4.5 py-3 max-[980px]:grid-cols-[72px_1fr_88px_1fr]"
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
      <Skeleton className="h-7.5 w-7.5 rounded-full" />
    </div>

    <div className="flex flex-col items-center gap-1.5">
      <Skeleton className="h-5 w-10" />
      <Skeleton className="h-3 w-8" />
    </div>

    <div className="flex items-center justify-start gap-2">
      <Skeleton className="h-7.5 w-7.5 rounded-full" />
      <Skeleton className="h-3.5 w-20" />
    </div>

    <div className="flex items-center gap-1.5 max-[980px]:hidden">
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

export interface MatchesSkeletonProps {
  season: string;
}

/**
 * MatchesSkeleton — MatchesTab 로딩 상태. Shell·PanelHead·필터 행 자리표시자 +
 * SKELETON_ROW_COUNT개의 MatchRow 형태 자리표시자를 렌더한다(decision-5 §1-(1)(2) —
 * 콘텐츠 시작점보다 위에 있는 래퍼는 전부 재현한다). role="status"·aria-live="polite"로
 * 스크린리더에 로딩 중임을 알리고, 실제로 읽힐 텍스트(sr-only)를 안에 둔다 — aria-label은
 * 영역의 "이름"일 뿐 live region 알림의 "내용"이 아니다. 시각적 자리표시자는
 * aria-hidden 래퍼로 감싸 접근성 트리에서 제외한다.
 */
export function MatchesSkeleton({ season }: MatchesSkeletonProps) {
  return (
    <div role="status" aria-live="polite" aria-label={SKELETON_ARIA_LABEL}>
      <span className="sr-only">{SKELETON_ARIA_LABEL}</span>
      <div aria-hidden>
        <Shell className={PANEL_SHELL_CLASS}>
          <PanelHead {...matchesPanelHead(season)} />
          {SKEL_FILTER_ROW}
          {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
            <Fragment key={index}>{SKEL_ROW}</Fragment>
          ))}
        </Shell>
      </div>
    </div>
  );
}

export { FILTER_LABEL_LINE_H, SKELETON_ROW_COUNT };
