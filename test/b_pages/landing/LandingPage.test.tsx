/**
 * LandingPage 통합 스모크 테스트.
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트 가능
 * - <main> 존재 및 4개 섹션 헤딩 텍스트 확인
 *
 * ⚠️ 아키텍처 주의: LandingPage = <main> + 4 섹션만.
 *    Nav(<header>)와 Footer(<footer>)는 app/layout 전역 소관이며
 *    @widgets/Navbar · @widgets/Footer 위젯 테스트에서 별도 검증한다.
 *    이 스모크 테스트에서 nav/footer 존재를 기대하지 않는다.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

afterEach(cleanup);

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={String(href)} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

import { LandingPage } from '@pages/landing';

describe('LandingPage 스모크', () => {
  it('런타임 에러 없이 마운트되고 <main> 존재', () => {
    const { container } = render(<LandingPage />);
    expect(container.querySelector('main')).not.toBeNull();
  });

  it('Hero 헤드라인 텍스트 포함', () => {
    const { container } = render(<LandingPage />);
    expect(container.textContent).toContain('올드 트래포드');
  });

  it('MatchStrip 섹션 헤딩 존재', () => {
    const { container } = render(<LandingPage />);
    expect(container.textContent).toContain('최근 경기');
  });

  it('카테고리 섹션 헤딩 존재', () => {
    const { container } = render(<LandingPage />);
    expect(container.textContent).toContain('무엇을 찾고 있나요');
  });

  it('스쿼드 섹션 헤딩 존재', () => {
    const { container } = render(<LandingPage />);
    expect(container.textContent).toContain('스쿼드');
  });
});
