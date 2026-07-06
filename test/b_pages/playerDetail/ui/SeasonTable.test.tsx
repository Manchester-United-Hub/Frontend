/**
 * SeasonTable 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 필수 시나리오(plan.json verification.qa_guidance #4): 시즌표 통산 합계 행 = 통산 스탯.
 * derive.test.ts가 deriveSeasonRows의 "합계=통산" 불변식을 순수 함수 레벨에서
 * 이미 검증하므로, 여기서는 그 불변식이 실제 렌더된 DOM(통산 행)에도 정확히
 * 반영되는지 — 그리고 실제 model(getPlayerById + deriveSeasonRows)과 연결했을 때도
 * 성립하는지(통합) 확인한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { deriveSeasonRows, getPlayerById } from '@pages/playerDetail/model';
import { SeasonTable } from '@pages/playerDetail/ui';

afterEach(cleanup);

describe('SeasonTable — 시맨틱 구조', () => {
  it('열 헤더(시즌/출전/득점/도움)와 행 헤더(시즌 라벨)를 렌더한다', () => {
    render(
      <SeasonTable
        rows={[{ season: '2020/21', apps: 30, goals: 5, assists: 3 }]}
        career={{ apps: 30, goals: 5, assists: 3 }}
      />
    );

    expect(screen.getByRole('columnheader', { name: '시즌' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '출전' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '득점' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '도움' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2020/21' })).toBeInTheDocument();
  });
});

describe('SeasonTable — 통산 합계 행 = 통산 스탯 (필수 시나리오 #4)', () => {
  it('고정 props: 통산 행 셀 값이 career prop과 정확히 일치한다', () => {
    const career = { apps: 55, goals: 12, assists: 9 };
    render(
      <SeasonTable
        rows={[
          { season: '2020/21', apps: 20, goals: 4, assists: 3 },
          { season: '2021/22', apps: 35, goals: 8, assists: 6 },
        ]}
        career={career}
      />
    );

    const totalRow = screen.getByRole('rowheader', { name: '통산' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([String(career.apps), String(career.goals), String(career.assists)]);
  });

  it('통합: getPlayerById + deriveSeasonRows로 만든 실제 시즌표도 통산 행 = career', () => {
    const bruno = getPlayerById('bruno')!;
    const rows = deriveSeasonRows(bruno);
    render(<SeasonTable rows={rows} career={bruno.career} />);

    const totalRow = screen.getByRole('rowheader', { name: '통산' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([
      String(bruno.career.apps),
      String(bruno.career.goals),
      String(bruno.career.assists),
    ]);

    // 데이터 행 합계도 통산과 정확히 일치해야 한다(회귀 가드 — ADR-3 잔여 보정).
    const summed = rows.reduce(
      (acc, row) => ({
        apps: acc.apps + row.apps,
        goals: acc.goals + row.goals,
        assists: acc.assists + row.assists,
      }),
      { apps: 0, goals: 0, assists: 0 }
    );
    expect(summed).toEqual(bruno.career);
  });

  it('통합: 통산 통계가 시즌 수 대비 적은 선수(martinez)도 음수 없이 합계=통산이 유지된다', () => {
    const martinez = getPlayerById('martinez')!;
    const rows = deriveSeasonRows(martinez);
    render(<SeasonTable rows={rows} career={martinez.career} />);

    rows.forEach((row) => {
      expect(row.apps).toBeGreaterThanOrEqual(0);
      expect(row.goals).toBeGreaterThanOrEqual(0);
      expect(row.assists).toBeGreaterThanOrEqual(0);
    });

    const totalRow = screen.getByRole('rowheader', { name: '통산' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([
      String(martinez.career.apps),
      String(martinez.career.goals),
      String(martinez.career.assists),
    ]);
  });
});
