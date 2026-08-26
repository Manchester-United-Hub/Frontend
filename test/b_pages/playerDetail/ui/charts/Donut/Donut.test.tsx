/**
 * Donut 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 필수 시나리오 #5: 차트 접근성(role=img + aria-label). 경계값: goals=assists=0.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Donut } from '@pages/playerDetail/ui/charts/Donut';

afterEach(cleanup);

describe('Donut', () => {
  it('role=img + "공격 포인트 {합}" aria-label로 렌더된다', () => {
    render(<Donut goals={12} assists={8} />);
    const chart = screen.getByRole('img', { name: '공격 포인트 20' });
    expect(chart.tagName.toLowerCase()).toBe('svg');
  });

  it('득점·도움 범례를 값과 함께 렌더한다', () => {
    render(<Donut goals={12} assists={8} />);
    expect(screen.getByText('득점 12')).toBeInTheDocument();
    expect(screen.getByText('도움 8')).toBeInTheDocument();
  });

  it('경계값: goals=assists=0이어도 에러 없이 렌더되고 합계 0을 표시한다(0으로 나누기 가드)', () => {
    render(<Donut goals={0} assists={0} />);
    expect(screen.getByRole('img', { name: '공격 포인트 0' })).toBeInTheDocument();
    expect(screen.getByText('득점 0')).toBeInTheDocument();
    expect(screen.getByText('도움 0')).toBeInTheDocument();
  });
});
