import { getZoneColorStyle } from '@entities/rank/model';
import type { Standing } from '@entities/rank/types';
import { cn } from '@shared/utils';
import { Crest } from '@shared/ui';

import { FormPills } from './FormPills';
// import { MovementIndicator } from './MovementIndicator';

const CELL = 'h-12 border-b border-border px-2.5 text-center text-[13px]';
const HIDE_SM = 'max-[620px]:hidden';
const HIDE_MD = 'max-[980px]:hidden';

const goalDiffColorClassName = (goalDiff: number): string => {
  if (goalDiff > 0) return 'text-win';
  if (goalDiff < 0) return 'text-united-red';
  return '';
};

export interface StandingsRowProps {
  standing: Standing;
}

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
          className={cn('absolute inset-y-0 left-0 w-0.75', posBar.className)}
          style={posBar.style}
        />
        <span className="font-bold">{standing.pos}</span>
      </td>
      {/* <td className={CELL}>
        <MovementIndicator movement={standing.mv} className="mx-auto" />
      </td> */}
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
        {standing.diff}
      </td>
      <td className={cn(CELL, HIDE_MD)}>
        <FormPills form={standing.form} className="justify-center" />
      </td>
      <td className={cn(CELL, 'text-[15px] font-extrabold')}>{standing.pts}</td>
    </tr>
  );
}
