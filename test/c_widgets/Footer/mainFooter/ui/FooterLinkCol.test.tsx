/**
 * FooterLinkCol 단위 테스트 — heading, 링크 label·href 렌더, 링크 없는 열.
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

import { FooterLinkCol } from '@widgets/Footer/mainFooter/ui/FooterLinkCol';

describe('FooterLinkCol', () => {
  it('heading을 h3로 렌더한다', () => {
    render(<FooterLinkCol heading="둘러보기" links={[{ label: '시즌', href: '/season' }]} />);
    expect(screen.getByRole('heading', { level: 3, name: '둘러보기' })).toBeInTheDocument();
  });

  it('각 링크를 label과 href로 렌더한다', () => {
    render(
      <FooterLinkCol
        heading="둘러보기"
        links={[
          { label: '시즌', href: '/season' },
          { label: '선수', href: '/players' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: '시즌' })).toHaveAttribute('href', '/season');
    expect(screen.getByRole('link', { name: '선수' })).toHaveAttribute('href', '/players');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('링크가 비어 있으면 항목을 렌더하지 않는다', () => {
    render(<FooterLinkCol heading="더보기" links={[]} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
