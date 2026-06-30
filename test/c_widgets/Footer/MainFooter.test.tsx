/**
 * MainFooter 위젯 단위 테스트.
 *
 * 검증 목적:
 * - <footer> 시맨틱 엘리먼트 렌더
 * - 링크 컬럼 헤딩 3개 렌더 (둘러보기·구단·더보기)
 * - 둘러보기 컬럼 링크 텍스트 (시즌·선수·하이라이트·기사)
 * - 저작권 텍스트 (Manchester United FC Hub · 2026)
 * - 로고 워드마크 텍스트 (MANCHESTER UNITED)
 * - 링크 항목 수 ≥ 12 (3컬럼 × 4) — ADR-7 비링크(span), dead link 없음
 *
 * ⚠️ Footer는 app/layout 전역 소관. LandingPage 내부에 포함되지 않으므로
 *    LandingPage 스모크에서 footer를 기대하지 않는다 — 이 파일에서만 검증.
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

import { MainFooter } from '@widgets/Footer/mainFooter/Footer';

describe('MainFooter 위젯', () => {
  it('<footer> 시맨틱 엘리먼트 렌더', () => {
    const { container } = render(<MainFooter />);
    expect(container.querySelector('footer')).not.toBeNull();
  });

  it('링크 컬럼 헤딩 3개 렌더 (둘러보기·더보기 포함)', () => {
    const { container } = render(<MainFooter />);
    const text = container.textContent ?? '';
    ['둘러보기', '더보기'].forEach((heading) => {
      expect(text).toContain(heading);
    });
  });

  it('둘러보기 컬럼 링크 텍스트 (시즌·선수·하이라이트·기사)', () => {
    const { container } = render(<MainFooter />);
    const text = container.textContent ?? '';
    ['시즌', '선수', '하이라이트', '기사'].forEach((link) => {
      expect(text).toContain(link);
    });
  });

  it('저작권 텍스트 존재 (Manchester United FC Hub / 2026)', () => {
    const { container } = render(<MainFooter />);
    expect(container.textContent).toContain('Manchester United FC Hub');
    expect(container.textContent).toContain('2026');
  });

  it('로고 워드마크 텍스트 존재 (MANCHESTER UNITED)', () => {
    const { container } = render(<MainFooter />);
    expect(container.textContent).toContain('MANCHESTER UNITED');
  });

  it('링크 컬럼 항목 12개 렌더(3컬럼×4) — ADR-7: 라우트 미존재로 비링크(span) 처리', () => {
    const { container } = render(<MainFooter />);
    const items = container.querySelectorAll('footer ul[role="list"] li');
    expect(items.length).toBeGreaterThanOrEqual(12);
    // dead link(href="#")를 남기지 않는다
    expect(container.querySelectorAll('footer a[href="#"]').length).toBe(0);
  });
});
