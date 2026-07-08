/**
 * SeasonHeader 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: eyebrow·h1(시즌)·설명 문단 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SeasonHeader } from '@pages/season/ui/SeasonHeader';

afterEach(cleanup);

describe('SeasonHeader', () => {
  it('eyebrow·h1("시즌")·설명 문단을 렌더한다', () => {
    render(<SeasonHeader />);

    expect(screen.getByText('2025/26 Premier League')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '시즌' })).toBeInTheDocument();
    expect(
      screen.getByText('일정과 결과, 프리미어리그 순위표를 한곳에서 확인하세요.')
    ).toBeInTheDocument();
  });
});
