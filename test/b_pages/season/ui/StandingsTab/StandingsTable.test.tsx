/**
 * StandingsTable 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: sr-only caption, 12개 컬럼 헤더(th scope="col"), 20개 팀 데이터 행.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StandingsTable } from '@pages/season/ui/StandingsTab/StandingsTable';
import { standings } from '@pages/season/model';

afterEach(cleanup);

describe('StandingsTable', () => {
  it('caption·12개 컬럼 헤더(th scope=col)·20개 데이터 행을 렌더한다', () => {
    render(<StandingsTable standings={standings} />);

    expect(screen.getByText('2025/26 프리미어리그 순위표')).toBeInTheDocument();

    const table = screen.getByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(12);
    headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));

    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(standings.length + 1); // +1 헤더 행
  });
});
