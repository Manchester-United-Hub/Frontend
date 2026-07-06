/**
 * Ring 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * 필수 시나리오 #5: 차트 접근성(role=img + aria-label). 경계값: value > max(초과 클램프).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { Ring } from '@pages/playerDetail/ui/charts/Ring';

afterEach(cleanup);

describe('Ring', () => {
  it('role=img + "{label} {value}" aria-label로 렌더된다', () => {
    render(<Ring value={30} max={38} label="출전" />);
    expect(screen.getByRole('img', { name: '출전 30' })).toBeInTheDocument();
  });

  it('범례에 "{label} {value} / {max}"를 렌더한다', () => {
    render(<Ring value={30} max={38} label="출전" />);
    expect(screen.getByText('출전 30 / 38')).toBeInTheDocument();
  });

  it('경계값: value=0이면 진행률 0으로 에러 없이 렌더된다', () => {
    render(<Ring value={0} max={38} label="출전" />);
    expect(screen.getByRole('img', { name: '출전 0' })).toBeInTheDocument();
  });

  it('경계값: value가 max를 초과해도 100%로 클램프되어 에러 없이 렌더된다', () => {
    const { container } = render(<Ring value={50} max={38} label="출전" />);
    expect(screen.getByRole('img', { name: '출전 50' })).toBeInTheDocument();
    const progressCircle = container.querySelectorAll('circle')[1] as SVGCircleElement;
    const circumference = 2 * Math.PI * 52;
    const [dashLength] = (progressCircle.getAttribute('stroke-dasharray') ?? '').split(' ').map(Number);
    expect(dashLength).toBeCloseTo(circumference, 5);
  });
});
