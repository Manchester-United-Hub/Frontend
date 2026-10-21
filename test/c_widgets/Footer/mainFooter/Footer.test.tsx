/**
 * MainFooter 위젯 단위 테스트.
 *
 * 검증 목적:
 * - <footer> 시맨틱 엘리먼트 렌더
 * - 링크 컬럼 헤딩 2개 렌더 (둘러보기·더보기), 구단 열 없음
 * - 둘러보기 컬럼 링크 텍스트 (시즌·선수·기사)
 * - 저작권 텍스트 (Manchester United FC Hub · 2026)
 * - 로고 워드마크 텍스트 (MANCHESTER UNITED)
 * - 링크 4개의 href가 실제 라우트 — dead link 없음, 비노출 항목 없음
 * - 구장 사진 라이선스 크레딧 textContent (D-6/D-8 원문 일치)
 * - 라이선스 앵커의 href·target·rel
 *
 * ⚠️ Footer는 app/layout 전역 소관. LandingPage 내부에 포함되지 않으므로
 *    LandingPage 스모크에서 footer를 기대하지 않는다 — 이 파일에서만 검증.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
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

  it('링크 컬럼 헤딩 렌더 (둘러보기·더보기)', () => {
    const { container } = render(<MainFooter />);
    const text = container.textContent ?? '';
    ['둘러보기', '더보기'].forEach((heading) => {
      expect(text).toContain(heading);
    });
  });

  it('둘러보기 컬럼 링크 텍스트 (시즌·선수·기사)', () => {
    const { container } = render(<MainFooter />);
    const text = container.textContent ?? '';
    ['시즌', '선수', '기사'].forEach((link) => {
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

  it('링크 항목 5개가 실제 라우트로 연결되고 dead link가 없다', () => {
    const { container } = render(<MainFooter />);
    const items = container.querySelectorAll('footer ul[role="list"] li');
    expect(items.length).toBe(4);
    const hrefs = Array.from(
      container.querySelectorAll('footer ul[role="list"] a[href]'),
    ).map((anchor) => anchor.getAttribute('href'));
    expect(hrefs).toEqual(['/season', '/players', '/club', '/news']);
    expect(container.querySelectorAll('footer a[href="#"]').length).toBe(0);
  });

  it('구단 열과 라우트 없는 항목은 노출하지 않는다', () => {
    const { container } = render(<MainFooter />);
    const text = container.textContent ?? '';
    ['연혁', '검색', 'RSS', '문의'].forEach((removed) => {
      expect(text).not.toContain(removed);
    });
    const headings = Array.from(container.querySelectorAll('footer h3')).map(
      (heading) => heading.textContent,
    );
    expect(headings).toEqual(['둘러보기', '더보기']);
  });

  it('구장 사진 라이선스 크레딧 textContent가 D-6 원문과 일치', () => {
    const { container } = render(<MainFooter />);
    expect(container.textContent).toContain('Photo: Arne Müseler / CC BY-SA 3.0');
  });

  it('라이선스 앵커의 href·target·rel', () => {
    const { container } = render(<MainFooter />);
    const anchor = container.querySelector('footer a[href="https://creativecommons.org/licenses/by-sa/3.0/"]');
    expect(anchor).not.toBeNull();
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noreferrer');
  });
});
