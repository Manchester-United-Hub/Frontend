/**
 * ZoneLegend 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 4개 존 라벨 렌더, ucl/releg는 토큰 클래스(bg-win/bg-united-red)로,
 * uel/conf는 raw hex 인라인 style로 렌더되는가(zoneColor.ts 결정 사항 검증).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { ZoneLegend } from '@entities/rank/ui';
import { zoneLegend } from '@entities/rank/ui/configs';

afterEach(cleanup);

describe('ZoneLegend', () => {
  it('4개 존 항목을 라벨과 함께 렌더한다', () => {
    render(<ZoneLegend />);
    const list = screen.getByRole('list', { name: '순위표 존 범례' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(4);
    zoneLegend.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('ucl/releg는 토큰 클래스로, uel/conf는 raw hex 인라인 style로 렌더된다', () => {
    const { container } = render(<ZoneLegend />);
    const swatches = container.querySelectorAll('span[aria-hidden="true"]');

    // zoneLegend 순서(mockData): ucl · uel · conf · releg
    expect(swatches[0]).toHaveClass('bg-win');
    expect(swatches[1]).toHaveStyle({ backgroundColor: '#2a6fdb' });
    expect(swatches[2]).toHaveStyle({ backgroundColor: '#7c5cd6' });
    expect(swatches[3]).toHaveClass('bg-united-red');
  });
});
