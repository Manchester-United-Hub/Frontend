import { Fragment } from 'react';

import { PANEL_SHELL_CLASS, PanelHead, Shell, Skeleton } from '@shared/ui';

import { cn } from '@shared/utils';

import { standingsPanelHead } from '../Panel';
import {
  HIDE_MD,
  HIDE_SM,
  TABLE_CLASS,
  TABLE_SCROLLER_CLASS,
  TH,
} from '@entities/rank/ui/StandingsTable';

const SKELETON_ARIA_LABEL = '시즌 순위표를 불러오는 중';
const SKELETON_ROW_COUNT = 20;

const CELL =
  ' h-12 border-b border-border px-2.5 text-center text-[13px] align-middle';

const SKEL_ROW = (
  <tr className="transition-colors hover:bg-accent">
    <td className={cn(CELL, 'relative w-5')}>
      <Skeleton className="absolute inset-y-0 left-0 w-0.75" />
      <Skeleton className="w-8 h-8" />
    </td>

    <td className={cn(CELL, 'text-left')}>
      <div className="flex items-center gap-2.5">
        <Skeleton className="grid h-7.5 w-7.5 flex-none place-items-center rounded-full border-gray-400 text-[11px] font-extrabold content-center" />
        <Skeleton className="truncate font-medium w-80 h-8" />
      </div>
    </td>
    <td className={CELL}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, HIDE_SM)}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, HIDE_SM)}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, HIDE_SM)}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, HIDE_MD)}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, HIDE_MD)}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, 'font-semibold')}>
      <Skeleton className="w-10 h-8" />
    </td>
    <td className={cn(CELL, HIDE_MD)}>
      <Skeleton className="w-32 h-8" />
    </td>
    <td className={cn(CELL, 'text-[18px] font-extrabold')}>
      <Skeleton className="w-10 h-8" />
    </td>
  </tr>
);

/**
 * StandingSkeleton — StandingsPanel의 Suspense fallback(SeasonPage.tsx:30).
 *
 * ⚠️ 이 컴포넌트는 <table>/<thead>/<tbody> 구조를 반드시 유지해야 한다. 과거 이 파일은
 * <div> 안에 <thead>·<tr>을 직접 넣고 있었고(F-26), 클라이언트 렌더에서는 DOM 중첩
 * 경고에 그쳤지만 SSR에서는 브라우저 파서가 그 요소들을 table 밖으로 밀어내(foster
 * parenting) 서버 DOM ≠ 클라이언트 트리가 되어 하이드레이션 에러를 만든다.
 * <tbody>도 필수다 — 생략하면 파서가 자동 삽입해 같은 불일치가 다시 생긴다.
 * 이 계약은 StandingSkeleton.test.tsx의 SSR 파싱 대조 케이스가 지킨다.
 *
 * 컨테이너 클래스는 StandingsTable.tsx에서 export하는 TABLE_SCROLLER_CLASS·TABLE_CLASS를
 * import해서 쓴다(F-34 게이트 — 두 파일에 따로 적으면 한쪽만 바뀌어도 드리프트가 통과한다.
 * 지우는 순간 양쪽이 같이 바뀌어 드리프트 자체가 불가능해진다). TH·HIDE_SM·HIDE_MD도
 * StandingsTable에서 import한다(과거 이 파일이 같은 값을 따로 선언해 두 파일의 구조가
 * 갈라지는 통로가 됐다 — F-26 §1.1(3)).
 */
export interface StandingSkeletonProps {
  season: string;
}

export function StandingSkeleton({ season }: StandingSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={SKELETON_ARIA_LABEL}
      className="w-full"
    >
      <span className="sr-only">{SKELETON_ARIA_LABEL}</span>
      <div aria-hidden>
        <Shell className={PANEL_SHELL_CLASS}>
          <PanelHead {...standingsPanelHead(season)} />
          {/* ZoneLegend(StandingsTab.tsx:26-28)는 표 **아래**에 있어 없어도 화면에 이미
              보이는 요소를 하나도 밀지 않는다. 반면 넣으면 375px에서 flex-wrap 줄 수가
              폭마다 달라지는 미실측 블록이 늘어난다 → 의도적 제외(decision-5 §1-(2)). */}
          <div className={TABLE_SCROLLER_CLASS}>
            <table className={TABLE_CLASS}>
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th scope="col" className={TH}>
                    #
                  </th>
                  {/* <th scope="col" className={TH}>
                      변동
                    </th> */}
                  <th scope="col" className={cn(TH, 'text-left')}>
                    클럽
                  </th>
                  <th scope="col" className={TH}>
                    경기
                  </th>
                  <th scope="col" className={cn(TH, HIDE_SM)}>
                    승
                  </th>
                  <th scope="col" className={cn(TH, HIDE_SM)}>
                    무
                  </th>
                  <th scope="col" className={cn(TH, HIDE_SM)}>
                    패
                  </th>
                  <th scope="col" className={cn(TH, HIDE_MD)}>
                    득점
                  </th>
                  <th scope="col" className={cn(TH, HIDE_MD)}>
                    실점
                  </th>
                  <th scope="col" className={TH}>
                    득실
                  </th>
                  <th scope="col" className={cn(TH, HIDE_MD)}>
                    최근 5경기
                  </th>
                  <th scope="col" className={TH}>
                    승점
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                  <Fragment key={index}>{SKEL_ROW}</Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Shell>
      </div>
    </div>
  );
}
