import { Fragment } from 'react';

import { Skeleton } from '@shared/ui';

import { cn } from '@shared/utils';

const SKELETON_ARIA_LABEL = '시즌 순위표를 불러오는 중';
const SKELETON_ROW_COUNT = 20;

const CELL =
  ' h-12 border-b border-border px-2.5 text-center text-[13px] align-middle';
export const TH =
  'h-[42px] px-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.04em]';
const HIDE_SM = 'max-[620px]:hidden';
const HIDE_MD = 'max-[980px]:hidden';

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

export function StandingSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={SKELETON_ARIA_LABEL}
      className="w-full"
    >
      <span className="sr-only">{SKELETON_ARIA_LABEL}</span>

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
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <Fragment key={index}>{SKEL_ROW}</Fragment>
      ))}
    </div>
  );
}
