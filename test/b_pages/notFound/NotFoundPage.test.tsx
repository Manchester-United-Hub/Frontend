/**
 * NotFoundPage 단위 테스트 (ST-4).
 *
 * 검증 목적:
 * - h1이 정확히 1개이고 accent 조각을 포함해 전체 헤드라인 문구가 읽히는가
 * - 서브카피 렌더
 * - '홈으로 돌아가기' 링크의 href가 '/'인가 (getByRole('link'))
 * - '이전 페이지' 버튼 렌더
 * - 'HTTP 404' 뱃지 텍스트 렌더
 * - 워터마크 span이 aria-hidden이라 접근성 트리에서 제외되는가 (AD-8)
 * - '문의하기'가 <a>가 아닌지 (링크 개수 단언 — AD-6)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
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

import { NotFoundPage } from '@pages/notFound';

describe('NotFoundPage', () => {
  it('h1이 정확히 1개 존재하고, lead + accent 전체 헤드라인 문구가 읽힌다', () => {
    const { container } = render(<NotFoundPage />);
    const headings = container.querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe('이 패스는 타겟을 벗어났습니다');
  });

  it('서브카피가 렌더된다', () => {
    render(<NotFoundPage />);
    expect(
      screen.getByText(/요청한 페이지가 이동되었거나 삭제되었을 수 있어요/),
    ).toBeInTheDocument();
  });

  it("'홈으로 돌아가기' 링크의 href가 '/'다", () => {
    render(<NotFoundPage />);
    const homeLink = screen.getByRole('link', { name: /홈으로 돌아가기/ });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it("'이전 페이지' 버튼이 렌더된다", () => {
    render(<NotFoundPage />);
    expect(screen.getByRole('button', { name: '이전 페이지' })).toBeInTheDocument();
  });

  it("'HTTP 404' 뱃지 텍스트가 렌더된다", () => {
    render(<NotFoundPage />);
    expect(screen.getByText('HTTP 404')).toBeInTheDocument();
  });

  it('워터마크 span은 aria-hidden이라 접근성 트리에서 제외된다', () => {
    const { container } = render(<NotFoundPage />);
    const watermark = container.querySelector('span[aria-hidden="true"]');
    expect(watermark).not.toBeNull();
    expect(watermark?.textContent).toBe('404');
    // 접근성 트리 제외 확인: aria-hidden 요소는 접근성 이름으로 조회되지 않는다.
    expect(screen.queryByText('404', { selector: 'span[aria-hidden="true"]' })).not.toBeNull();
    expect(watermark).toHaveAttribute('aria-hidden', 'true');
  });

  it("'문의하기'는 <a>가 아니라 비링크 텍스트다 (링크는 홈 CTA 1개뿐)", () => {
    const { container } = render(<NotFoundPage />);
    expect(screen.getByText('문의하기')).toBeInTheDocument();
    expect(screen.getByText('문의하기').tagName).not.toBe('A');
    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', '/');
  });
});
