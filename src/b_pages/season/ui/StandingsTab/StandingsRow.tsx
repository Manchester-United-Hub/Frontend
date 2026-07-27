import { cn } from '@shared/utils';

import type { Standing } from '../../model';
import { Crest } from '../Crest';
import { FormPills } from './FormPills';
import { MovementIndicator } from './MovementIndicator';
import { getZoneColorStyle } from './zoneColor';

const CELL = 'h-12 border-b border-border px-2.5 text-center text-[13px]';
const HIDE_SM = 'max-[620px]:hidden';
const HIDE_MD = 'max-[980px]:hidden';

/** 득실차 = gf - ga (파생, 렌더 중 계산 — architecture.decisions). */
const formatGoalDiff = (goalDiff: number): string =>
  goalDiff > 0 ? `+${goalDiff}` : `${goalDiff}`;

const goalDiffColorClassName = (goalDiff: number): string => {
  if (goalDiff > 0) return 'text-win';
  if (goalDiff < 0) return 'text-united-red';
  return '';
};

export interface StandingsRowProps {
  standing: Standing;
}

/**
 * StandingsRow — 순위표 1행. 열 순서: #(posbar)·변동·클럽·경기·승·무·패·득점·실점·
 * 득실·최근5경기·승점. 승·무·패는 ≤620px, 득점·실점·최근5경기는 ≤980px에서 숨긴다
 * (design-ref col-hide-sm/col-hide-md). utd 행은 united-red 6%(hover 10%) 배경 강조.
 */
export function StandingsRow({ standing }: StandingsRowProps) {
  const goalDiff = standing.gf - standing.ga;
  const posBar = getZoneColorStyle(standing.zone);
  const rowClassName = standing.utd
    ? 'bg-united-red/6 transition-colors hover:bg-united-red/10'
    : 'transition-colors hover:bg-accent';

  return (
    <tr className={rowClassName}>
      <td className={cn(CELL, 'relative')}>
        <span
          aria-hidden="true"
          className={cn('absolute inset-y-0 left-0 w-[3px]', posBar.className)}
          style={posBar.style}
        />
        <span className="font-bold">{standing.pos}</span>
      </td>
      <td className={CELL}>
        <MovementIndicator movement={standing.mv} className="mx-auto" />
      </td>
      <td className={cn(CELL, 'text-left')}>
        <div className="flex items-center gap-2.5">
          <Crest
            teamLogoUrl={standing.teamLogoUrl}
            code={standing.code}
            utd={standing.utd}
          />
          <span
            className={cn(
              'truncate',
              standing.utd ? 'font-bold' : 'font-medium'
            )}
          >
            {standing.nm}
          </span>
        </div>
      </td>
      <td className={CELL}>{standing.p}</td>
      <td className={cn(CELL, HIDE_SM)}>{standing.w}</td>
      <td className={cn(CELL, HIDE_SM)}>{standing.d}</td>
      <td className={cn(CELL, HIDE_SM)}>{standing.l}</td>
      <td className={cn(CELL, HIDE_MD)}>{standing.gf}</td>
      <td className={cn(CELL, HIDE_MD)}>{standing.ga}</td>
      <td
        className={cn(CELL, 'font-semibold', goalDiffColorClassName(goalDiff))}
      >
        {formatGoalDiff(goalDiff)}
      </td>
      <td className={cn(CELL, HIDE_MD)}>
        <FormPills form={standing.form} className="justify-center" />
      </td>
      <td className={cn(CELL, 'text-[15px] font-extrabold')}>{standing.pts}</td>
    </tr>
  );
}
