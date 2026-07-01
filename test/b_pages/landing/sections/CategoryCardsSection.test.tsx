/**
 * CategoryCardsSection 단위 테스트.
 *
 * 검증 목적:
 * - 5개 카테고리 한글·영문 이름 렌더
 * - 카드 설명 텍스트 존재
 * - ul[role=list] li 5개 렌더
 * - 섹션 aria-labelledby 시맨틱
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

import { CategoryCardsSection } from '@pages/landing/ui/CategoryCardsSection';
import { categories } from '@pages/landing/model/mockData';

describe('CategoryCardsSection', () => {
  it('카테고리 5개 한글 이름 모두 렌더', () => {
    const { container } = render(<CategoryCardsSection categories={categories} />);
    const text = container.textContent ?? '';
    ['시즌', '선수', '구단', '하이라이트', '기사'].forEach((name) => {
      expect(text).toContain(name);
    });
  });

  it('영문 카테고리 5개 nameEn 모두 렌더', () => {
    const { container } = render(<CategoryCardsSection categories={categories} />);
    const text = container.textContent ?? '';
    ['Season', 'Players', 'Club', 'Highlights', 'Articles'].forEach((en) => {
      expect(text).toContain(en);
    });
  });

  it('카드 설명 텍스트 존재', () => {
    const { container } = render(<CategoryCardsSection categories={categories} />);
    expect(container.textContent).toContain('일정·결과·순위표');
  });

  it('카드 li 요소 5개 렌더 (ul role=list)', () => {
    const { container } = render(<CategoryCardsSection categories={categories} />);
    const list = container.querySelector('ul[role="list"]');
    expect(list).not.toBeNull();
    const items = list!.querySelectorAll('li');
    expect(items).toHaveLength(5);
  });

  it('섹션 aria-labelledby 시맨틱 존재', () => {
    const { container } = render(<CategoryCardsSection categories={categories} />);
    expect(container.querySelector('section[aria-labelledby]')).not.toBeNull();
  });

  it('매핑에 없는 key는 폴백 아이콘으로 렌더된다', () => {
    const { container } = render(
      <CategoryCardsSection
        categories={[
          { key: 'unknown', name: '기타', nameEn: 'Etc', description: 'd' },
        ]}
      />
    );
    // 폴백 아이콘(LayoutGrid) + goLabel chevron = svg 2개. 슬롯이 비지 않는다.
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
});
