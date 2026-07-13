/**
 * FormPills 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: 5개 배지를 순서대로 렌더, W/D/L 접근성 라벨(승/무/패)과 색 토큰
 * (bg-win/bg-draw/bg-loss) 대응.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { FormPills } from '@pages/season/ui/StandingsTab/FormPills';

afterEach(cleanup);

describe('FormPills', () => {
  it('5개의 결과 배지를 순서대로 렌더한다', () => {
    render(<FormPills form={['W', 'D', 'W', 'L', 'W']} />);
    const pills = screen.getAllByRole('img');
    expect(pills).toHaveLength(5);
    expect(pills.map((pill) => pill.textContent)).toEqual(['W', 'D', 'W', 'L', 'W']);
  });

  it('각 결과는 W=승/D=무/L=패 접근성 라벨과 대응 색 토큰 클래스를 갖는다', () => {
    render(<FormPills form={['W', 'D', 'L']} />);
    expect(screen.getByRole('img', { name: '승' })).toHaveClass('bg-win');
    expect(screen.getByRole('img', { name: '무' })).toHaveClass('bg-draw');
    expect(screen.getByRole('img', { name: '패' })).toHaveClass('bg-loss');
  });
});
