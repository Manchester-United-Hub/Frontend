/**
 * NavLinkItem 단위 테스트.
 *
 * 검증 목적:
 * - href 있음 → <a> 링크로 렌더 (item.href truthy 분기)
 * - href 없음 → <span> 비링크로 렌더 (else 분기, ADR-7 예정 라우트)
 * - label·labelEn(서브라벨) 동시 렌더
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

import { NavLinkItem } from '@widgets/Navbar/ui';
import type { NavItem } from '@widgets/Navbar/model';
import type { Route } from 'next';

const linkedItem: NavItem = {
  id: 'season',
  label: '시즌',
  labelEn: 'Season',
  href: '/season' as Route,
};

const plainItem: NavItem = {
  id: 'tbd',
  label: '준비중',
  labelEn: 'Coming Soon',
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
});
