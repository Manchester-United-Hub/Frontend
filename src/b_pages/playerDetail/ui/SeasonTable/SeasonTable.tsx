import { cn } from '@shared/utils';

import type { CareerTotals, SeasonRow } from '../../model/types';

/**
 * 시즌별 기록 표 (.season-table). 시맨틱 `<table>` + 열 헤더 `scope="col"`,
 * 시즌·통산 행 라벨은 `scope="row"`(행 헤더) — 시안(td.n)보다 한 단계 접근성을
 * 보강한다. 마지막 행(통산 합계)은 굵게 + 배경 강조.
 */
export interface SeasonTableProps {
  rows: SeasonRow[];
  career: CareerTotals;
}

const HEAD_CELL_CLASS_NAME =
  'border-b border-border bg-muted px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground';
const BODY_CELL_CLASS_NAME = 'border-b border-border px-4 py-3 text-left text-sm text-foreground';

export function SeasonTable({ rows, career }: SeasonTableProps) {
  return (
    <table className="mt-6 w-full border-collapse overflow-hidden rounded-lg border border-border">
      <caption className="sr-only">시즌별 기록</caption>
      <thead>
        <tr>
          <th scope="col" className={HEAD_CELL_CLASS_NAME}>
            시즌
          </th>
          <th scope="col" className={HEAD_CELL_CLASS_NAME}>
            출전
          </th>
          <th scope="col" className={HEAD_CELL_CLASS_NAME}>
            득점
          </th>
          <th scope="col" className={HEAD_CELL_CLASS_NAME}>
            도움
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.season}>
            <th scope="row" className={cn(BODY_CELL_CLASS_NAME, 'font-semibold')}>
              {row.season}
            </th>
            <td className={BODY_CELL_CLASS_NAME}>{row.apps}</td>
            <td className={BODY_CELL_CLASS_NAME}>{row.goals}</td>
            <td className={BODY_CELL_CLASS_NAME}>{row.assists}</td>
          </tr>
        ))}
        <tr className="bg-muted">
          <th scope="row" className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>
            통산
          </th>
          <td className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>{career.apps}</td>
          <td className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>{career.goals}</td>
          <td className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>{career.assists}</td>
        </tr>
      </tbody>
    </table>
  );
}
