/**
 * StandingsTab 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 패널 헤더·순위표·존 범례가 모두 렌더되는가.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StandingsTab } from '@pages/season/ui/StandingsTab';

afterEach(cleanup);

describe('StandingsTab', () => {
  it('패널 헤더·순위표·존 범례를 모두 렌더한다', () => {
    render(<StandingsTab />);
    expect(screen.getByRole('heading', { level: 2, name: '순위표' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: '순위표 존 범례' })).toBeInTheDocument();
  });
});
