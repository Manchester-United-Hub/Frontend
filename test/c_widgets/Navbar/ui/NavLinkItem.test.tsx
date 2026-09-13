/**
 * NavLinkItem 단위 테스트.
 *
 * NavItem.href가 필수가 되면서 href 없는 아이템은 타입에서 표현 불가해졌다. 그에 딸린
 * 두 케이스 — 'href 없으면 <span> 비링크'와 'isOuterLink인데 href 없으면 throw' — 는
 * 도달 경로가 사라져 삭제한다. 런타임 분기를 타입으로 옮긴 것이므로 커버리지 손실이 아니다.
 *
 * 검증 목적:
 * - 내부 링크 → <a> 링크로 렌더
 * - label·labelEn(서브라벨) 동시 렌더
 * - isOuterLink: true → target="_blank" 순수 <a>로 렌더, 외부 링크 아이콘 동반
 * - 외부 링크에는 rel="noreferrer"가 붙어 referrer가 새지 않는다
 * - 내부 링크(isOuterLink 미지정)에는 target 속성이 없음
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

const outerLinkItem: NavItem = {
  id: 'community',
  label: '커뮤니티',
  labelEn: 'Community',
  href: 'https://community.example.com' as Route,
  description: '외부 커뮤니티로 이동',
  isOuterLink: true,
};

describe('NavLinkItem', () => {
  it('내부 링크는 <a>로 렌더된다', () => {
    const { container } = render(<NavLinkItem item={linkedItem} />);
    const link = container.querySelector('a[href="/season"]');
    expect(link).not.toBeNull();
    expect(container.querySelector('span')).not.toBeNull(); // 서브라벨 span
  });

  it('label·labelEn 둘 다 렌더', () => {
    const { container } = render(<NavLinkItem item={linkedItem} />);
    expect(container.textContent).toContain('시즌');
    expect(container.textContent).toContain('Season');
  });

  it('isOuterLink: true면 target="_blank" 순수 <a>로 렌더 (외부 링크 분기)', () => {
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

  it('외부 링크에는 rel="noreferrer"가 붙어 referrer가 새지 않는다', () => {
    const { container } = render(<NavLinkItem item={outerLinkItem} />);
    const link = container.querySelector('a[target="_blank"]');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('내부 링크(isOuterLink 미지정)에는 target 속성이 없음', () => {
    const { container } = render(<NavLinkItem item={linkedItem} />);
    const link = container.querySelector('a[href="/season"]');
    expect(link).not.toHaveAttribute('target');
  });
});
