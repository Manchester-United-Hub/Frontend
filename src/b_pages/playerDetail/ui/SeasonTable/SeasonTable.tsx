import { cn } from '@shared/utils';

import type { CareerTotals, SeasonRow } from '../../model/types';

/**
 * 대회별 기록 표 (.season-table). 시맨틱 `<table>` + 열 헤더 `scope="col"`,
 * 대회·시즌 합계 행 라벨은 `scope="row"`(행 헤더) — 시안(td.n)보다 한 단계
 * 접근성을 보강한다. 마지막 행(시즌 합계)은 굵게 + 배경 강조.
 *
 * D-20: 파라미터가 단일 시즌이라 다중 시즌 호출을 하지 않는다 — 각 행은
 * "선택 시즌의 대회별" 기록이다(연도별 커리어 이력이 아님). 헤더 텍스트
 * '시즌'→'대회', 하단 합계 행 라벨 '통산'→'시즌 합계'로 바꿔 이 의미를
 * 반영한다(SeasonRow.season 필드명 자체는 유지, 담기는 값의 의미만 재정의).
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
      <caption className="sr-only">대회별 기록</caption>
      <thead>
        <tr>
          <th scope="col" className={HEAD_CELL_CLASS_NAME}>
            대회
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
            시즌 합계
          </th>
          <td className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>{career.apps}</td>
          <td className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>{career.goals}</td>
          <td className={cn(BODY_CELL_CLASS_NAME, 'border-b-0 font-bold')}>{career.assists}</td>
        </tr>
      </tbody>
    </table>
  );
}
