/**
 * NavLinkItem 단위 테스트.
 *
 * 검증 목적:
 * - href 있음 → <a> 링크로 렌더 (item.href truthy 분기)
 * - href 없음 → <span> 비링크로 렌더 (else 분기, ADR-7 예정 라우트)
 * - label·labelEn(서브라벨) 동시 렌더
 * - isOuterLink: true + href 있음 → target="_blank" 순수 <a>로 렌더, 외부 링크 아이콘 동반
 * - isOuterLink: true + href 없음 → 렌더 시 throw
 * - 내부 링크(href 있고 isOuterLink 미지정)에는 target 속성이 없음
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

import { NavLinkItem } from '@widgets/Navbar/ui';
import type { NavItem } from '@widgets/Navbar/model';
import type { Route } from 'next';

const linkedItem: NavItem = {
  id: 'season',
  label: '시즌',
  labelEn: 'Season',
  href: '/season' as Route,
  description: '시즌 일정과 순위',
};

const plainItem: NavItem = {
  id: 'tbd',
  label: '준비중',
  labelEn: 'Coming Soon',
  description: '준비 중인 메뉴',
};

const outerLinkItem: NavItem = {
  id: 'community',
  label: '커뮤니티',
  labelEn: 'Community',
  href: 'https://community.example.com' as Route,
  description: '외부 커뮤니티로 이동',
  isOuterLink: true,
};

const outerLinkItemWithoutHref: NavItem = {
  id: 'broken-outer',
  label: '깨진 외부 링크',
  labelEn: 'Broken Outer Link',
  description: 'href 없는 외부 링크',
  isOuterLink: true,
};

describe('NavLinkItem', () => {
  it('href 있으면 <a> 링크로 렌더 (item.href 분기)', () => {
    const { container } = render(<NavLinkItem item={linkedItem} />);
    const link = container.querySelector('a[href="/season"]');
    expect(link).not.toBeNull();
    expect(container.querySelector('span')).not.toBeNull(); // 서브라벨 span
  });

  it('href 없으면 <a> 없이 <span> 비링크로 렌더 (else 분기)', () => {
    const { container } = render(<NavLinkItem item={plainItem} />);
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('span')).not.toBeNull();
  });

  it('label·labelEn 둘 다 렌더', () => {
    const { container } = render(<NavLinkItem item={linkedItem} />);
    expect(container.textContent).toContain('시즌');
    expect(container.textContent).toContain('Season');
  });

  it('isOuterLink: true + href 있으면 target="_blank" 순수 <a>로 렌더 (외부 링크 분기)', () => {
    const { container } = render(<NavLinkItem item={outerLinkItem} />);
    const link = container.querySelector(
      'a[href="https://community.example.com"]'
    );
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('외부 링크에는 SquareArrowOutUpRight 아이콘 svg가 함께 렌더', () => {
    const { container } = render(<NavLinkItem item={outerLinkItem} />);
    expect(
      container.querySelector('svg.lucide-square-arrow-out-up-right')
    ).not.toBeNull();
  });

  it('isOuterLink: true인데 href 없으면 렌더가 throw', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<NavLinkItem item={outerLinkItemWithoutHref} />)).toThrow();

    consoleErrorSpy.mockRestore();
  });

  it('내부 링크(href 있고 isOuterLink 미지정)에는 target 속성이 없음', () => {
    const { container } = render(<NavLinkItem item={linkedItem} />);
    const link = container.querySelector('a[href="/season"]');
    expect(link).not.toHaveAttribute('target');
  });
});
