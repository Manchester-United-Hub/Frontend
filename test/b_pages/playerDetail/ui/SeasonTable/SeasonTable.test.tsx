/**
 * SeasonTable 테스트 — 실 API 데이터 기반 재작성(PD-3).
 *
 * D-20(PD-2)으로 표가 "선수 커리어 연도별 기록"에서 "선택 시즌의 대회별 기록"으로
 * 재정의됐다 — 헤더 텍스트 '시즌'→'대회', 하단 합계 행 라벨 '통산'→'시즌 합계'로
 * 바뀐다(SeasonRow.season 필드명 자체는 유지).
 *
 * 이전 버전은 `getPlayerById + deriveSeasonRows`(mock 커리어를 시즌 수로
 * 분할하는 알고리즘)로 통합 시나리오를 검증했으나, PD-3의 model 재작성으로
 * 그 함수들 자체가 사라졌다(실 API가 이미 대회별로 쪼개진 데이터를 주므로
 * 분할 알고리즘 자체가 불필요해짐 — D-20). 통합 검증은 `selectSeasonRows`/
 * `selectSeasonAggregate`(derive.ts)로 대체한다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { selectSeasonAggregate, selectSeasonRows } from '@pages/playerDetail/model/derive';
import { SeasonTable } from '@pages/playerDetail/ui';
import { buildStatisticsFixture } from '@test/b_pages/playerDetail/model/playerFixtures';

afterEach(cleanup);

describe('SeasonTable — 시맨틱 구조', () => {
  it('열 헤더(대회/출전/득점/도움)와 행 헤더(대회 라벨)를 렌더한다', () => {
    render(
      <SeasonTable
        rows={[{ season: '2020/21', apps: 30, goals: 5, assists: 3 }]}
        career={{ apps: 30, goals: 5, assists: 3 }}
      />
    );

    expect(screen.getByRole('columnheader', { name: '대회' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '출전' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '득점' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: '도움' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: '2020/21' })).toBeInTheDocument();
  });
});

describe('SeasonTable — 시즌 합계 행 = 시즌 합계 스탯 (필수 시나리오 #4)', () => {
  it('고정 props: 시즌 합계 행 셀 값이 career prop과 정확히 일치한다', () => {
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

    const totalRow = screen.getByRole('rowheader', { name: '시즌 합계' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual([String(career.apps), String(career.goals), String(career.assists)]);
  });

  it('통합: selectSeasonRows + selectSeasonAggregate(대회별 통계)로 만든 실제 시즌표도 시즌 합계 행 = 합계', () => {
    const stats = [
      buildStatisticsFixture({ leagueName: 'Premier League', appearances: 30, goals: 8, assists: 6 }),
      buildStatisticsFixture({ leagueId: 45, leagueName: 'FA Cup', appearances: 3, goals: 1, assists: 0 }),
      buildStatisticsFixture({ leagueId: 2, leagueName: 'UEFA Europa League', appearances: 6, goals: 2, assists: 1 }),
    ];
    const rows = selectSeasonRows(stats);
    const career = selectSeasonAggregate(rows);
    render(<SeasonTable rows={rows} career={career} />);

    expect(screen.getByRole('rowheader', { name: 'Premier League' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'FA Cup' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'UEFA Europa League' })).toBeInTheDocument();

    const totalRow = screen.getByRole('rowheader', { name: '시즌 합계' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual(['39', '11', '7']);

    // 데이터 행 합계도 시즌 합계와 정확히 일치해야 한다.
    expect(
      rows.reduce(
        (acc, row) => ({
          apps: acc.apps + row.apps,
          goals: acc.goals + row.goals,
          assists: acc.assists + row.assists,
        }),
        { apps: 0, goals: 0, assists: 0 }
      )
    ).toEqual(career);
  });

  it('통합: 대회 1건뿐인 선수(예: 유소년, 출전 기록 적음)도 합계=시즌 합계가 유지된다', () => {
    const stats = [buildStatisticsFixture({ leagueName: 'Premier League', appearances: 2, goals: 0, assists: 0 })];
    const rows = selectSeasonRows(stats);
    const career = selectSeasonAggregate(rows);
    render(<SeasonTable rows={rows} career={career} />);

    rows.forEach((row) => {
      expect(row.apps).toBeGreaterThanOrEqual(0);
      expect(row.goals).toBeGreaterThanOrEqual(0);
      expect(row.assists).toBeGreaterThanOrEqual(0);
    });

    const totalRow = screen.getByRole('rowheader', { name: '시즌 합계' }).closest('tr') as HTMLTableRowElement;
    const cells = within(totalRow).getAllByRole('cell');
    expect(cells.map((c) => c.textContent)).toEqual(['2', '0', '0']);
  });
});
