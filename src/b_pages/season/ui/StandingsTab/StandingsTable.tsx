import { cn } from '@shared/utils';

import type { Standing } from '../../model';
import { StandingsRow } from './StandingsRow';

const TH = 'h-[42px] px-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.04em]';
const HIDE_SM = 'max-[620px]:hidden';
const HIDE_MD = 'max-[980px]:hidden';

export interface StandingsTableProps {
  standings: Standing[];
}

/**
 * StandingsTable — 순위표. `<caption>`(sr-only)·`<th scope="col">`로 표 접근성을
 * 확보한다. 헤더(th)의 반응형 열숨김 클래스는 StandingsRow(td)와 정확히 동일해야
 * thead/tbody 열이 어긋나지 않는다 — HIDE_SM/HIDE_MD 상수를 여기서도 동일하게 적용.
 */
export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse">
        <caption className="sr-only">2025/26 프리미어리그 순위표</caption>
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th scope="col" className={TH}>
              #
            </th>
            <th scope="col" className={TH}>
              변동
            </th>
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
