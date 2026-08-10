import { Standing } from '@entities/rank/model';
import { cn } from '@shared/utils';

import { StandingsRow } from './StandingsRow';

export const TH =
  'h-[42px] px-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.04em]';
export const HIDE_SM = 'max-[620px]:hidden';
export const HIDE_MD = 'max-[980px]:hidden';

export interface StandingsTableProps {
  standings: Standing[];
  season: string;
}

export function StandingsTable({ standings, season }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto overflow-hidden">
      <table className="w-full min-w-140 border-collapse">
        <caption className="sr-only">{season} 프리미어리그 순위표</caption>
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
          {standings.map((standing) => (
            <StandingsRow key={standing.code} standing={standing} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
