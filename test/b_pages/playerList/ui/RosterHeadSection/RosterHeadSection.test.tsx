/**
 * RosterHeadSection 단위 테스트.
 *
 * 검증 목적:
 * - Eyebrow 문구·h1·설명문 렌더
 * - h1이 시맨틱 heading으로 렌더되는가 (a11y)
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { RosterHeadSection } from '@pages/playerList/ui/RosterHeadSection';

afterEach(cleanup);

describe('RosterHeadSection', () => {
  it('Eyebrow 문구를 렌더한다', () => {
    render(<RosterHeadSection />);
    expect(screen.getByText('First Team & Legends')).toBeInTheDocument();
  });

  it('h1으로 페이지 타이틀을 렌더한다', () => {
    render(<RosterHeadSection />);
    expect(
      screen.getByRole('heading', { level: 1, name: '역대 선수 목록' }),
    ).toBeInTheDocument();
  });

  it('설명문을 렌더한다', () => {
    render(<RosterHeadSection />);
    expect(
      screen.getByText('현역 1군부터 클럽의 레전드까지 — 포지션·연도·스쿼드로 좁혀 찾아보세요.'),
    ).toBeInTheDocument();
  });
});
