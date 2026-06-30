/**
 * Navbar 위젯 단위 테스트.
 *
 * 검증 목적:
 * - <header> 시맨틱 엘리먼트 렌더
 * - <nav aria-label="주요 메뉴"> 시맨틱 존재
 * - 메뉴 5개 한글 레이블 렌더 (시즌·선수·구단·하이라이트·기사)
 * - 메뉴 5개 영문 레이블 렌더 (Season·Players·Club·Highlights·Articles)
 * - href 값은 미래 라우트 예정 경로 — 404 여부는 검증하지 않음 (ADR-7)
 *
 * ⚠️ Nav는 app/layout 전역 소관. LandingPage 내부에 포함되지 않으므로
 *    LandingPage 스모크에서 nav를 기대하지 않는다 — 이 파일에서만 검증.
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

import { Navbar } from '@widgets/Navbar';

describe('Navbar 위젯', () => {
  it('<header> 시맨틱 엘리먼트 렌더', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('header')).not.toBeNull();
  });

  it('<nav aria-label="주요 메뉴"> 시맨틱 존재', () => {
    const { container } = render(<Navbar />);
    expect(container.querySelector('nav[aria-label="주요 메뉴"]')).not.toBeNull();
  });

  it('메뉴 5개 한글 레이블 렌더 (시즌·선수·구단·하이라이트·기사)', () => {
    const { container } = render(<Navbar />);
    const text = container.textContent ?? '';
    ['시즌', '선수', '구단', '하이라이트', '기사'].forEach((label) => {
      expect(text).toContain(label);
    });
  });

  it('메뉴 5개 영문 레이블 렌더 (Season·Players·Club·Highlights·Articles)', () => {
    const { container } = render(<Navbar />);
    const text = container.textContent ?? '';
    ['Season', 'Players', 'Club', 'Highlights', 'Articles'].forEach((label) => {
      expect(text).toContain(label);
    });
  });

  it('메뉴 링크 href 예정 경로 포함 (ADR-7: 404 여부 검증 금지)', () => {
    const { container } = render(<Navbar />);
    const links = container.querySelectorAll('nav a');
    // 5개 링크 존재 확인 (예정 라우트 — href 값 자체만 검증)
    expect(links.length).toBeGreaterThanOrEqual(5);
    const hrefs = Array.from(links).map((a) => (a as HTMLAnchorElement).getAttribute('href'));
    expect(hrefs).toContain('/season');
    expect(hrefs).toContain('/players');
    expect(hrefs).toContain('/club');
    expect(hrefs).toContain('/highlights');
    expect(hrefs).toContain('/articles');
  });
});
