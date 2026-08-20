/**
 * StandingsTable 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: sr-only caption(동적 season), 11개 컬럼 헤더(th scope="col"),
 * fixture 팀 수만큼의 데이터 행.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import {
  StandingsTable,
  TABLE_CLASS,
  TABLE_SCROLLER_CLASS,
} from '@entities/rank/ui/StandingsTable';

import { standings } from '@test/fixtures/standings';

afterEach(cleanup);

describe('StandingsTable', () => {
  it('caption·11개 컬럼 헤더(th scope=col)·데이터 행을 렌더한다', () => {
    const season = '2025-26';
    render(<StandingsTable standings={standings} season={season} />);

    expect(
      screen.getByText(`${season} 프리미어리그 순위표`)
    ).toBeInTheDocument();

    const table = screen.getByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(11);
    headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));

    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(standings.length + 1); // +1 헤더 행
  });

  // F-34 게이트 — 리터럴 기대값. StandingSkeleton이 이 두 상수를 import해서 쓰므로
  // min-w-140을 지우면 이 케이스가 즉시 빨개진다(구조적 단일 출처 위의 보조 그물).
  it('TABLE_CLASS·TABLE_SCROLLER_CLASS는 정해진 문자열이다 (F-34)', () => {
    expect(TABLE_CLASS).toBe('w-full min-w-140 border-collapse');
    expect(TABLE_SCROLLER_CLASS).toBe('overflow-x-auto overflow-hidden');
  });
});
