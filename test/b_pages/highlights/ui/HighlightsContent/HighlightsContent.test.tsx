import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightsContent } from '@pages/highlights/ui/HighlightsContent';
import type { HighlightItem } from '@pages/highlights/model';

afterEach(cleanup);

const featured: HighlightItem = {
  id: 'f1',
  title: '대표 영상',
  category: '골',
  competition: '프리미어리그',
  date: '2025.05.18',
  views: '2.4M',
  duration: '1:42',
  featured: true,
  description: '대표 영상 설명',
};

const gridItems: HighlightItem[] = [
  { id: 'g1', title: '그리드 A', category: '골', competition: 'PL', date: '2025.05.01', views: '1.0M', duration: '1:00' },
  { id: 'g2', title: '그리드 B', category: '세이브', competition: 'PL', date: '2025.04.01', views: '2.0M', duration: '1:00' },
];

const noop = () => {};

const baseProps = {
  category: '전체' as const,
  sortKey: 'recent' as const,
  page: 1,
  changeCategory: noop,
  changeSort: noop,
  goToPage: noop,
};

describe('HighlightsContent', () => {
  it('로딩 중이면 스켈레톤만 렌더하고 필터 바·그리드는 렌더하지 않는다', () => {
    const { container } = render(
      <HighlightsContent
        {...baseProps}
        isLoading
        featured={undefined}
        pageItems={[]}
        totalCount={0}
        totalPages={0}
      />,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('로딩이 끝나면 필터 바·결과 개수·그리드를 렌더한다', () => {
    render(
      <HighlightsContent
        {...baseProps}
        isLoading={false}
        featured={undefined}
        pageItems={gridItems}
        totalCount={gridItems.length}
        totalPages={1}
      />,
    );

    expect(screen.getByRole('radiogroup', { name: '카테고리 필터' })).toBeInTheDocument();
    expect(screen.getByText(String(gridItems.length))).toBeInTheDocument();
    expect(screen.getByText(/개의 영상/)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('결과가 없으면 그리드가 빈 상태(StateBox)를 렌더한다', () => {
    render(
      <HighlightsContent
        {...baseProps}
        isLoading={false}
        featured={undefined}
        pageItems={[]}
        totalCount={0}
        totalPages={0}
      />,
    );

    expect(screen.getByText('해당 카테고리 영상이 없어요')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('showFeatured=true이고 featured가 있으면 FeaturedHighlight를 렌더한다', () => {
    render(
      <HighlightsContent
        {...baseProps}
        isLoading={false}
        featured={featured}
        pageItems={gridItems}
        totalCount={gridItems.length}
        totalPages={1}
        showFeatured
      />,
    );

    expect(screen.getByRole('heading', { level: 2, name: '대표 영상' })).toBeInTheDocument();
  });

  it('showFeatured=false면 featured가 있어도 FeaturedHighlight를 렌더하지 않는다', () => {
    render(
      <HighlightsContent
        {...baseProps}
        isLoading={false}
        featured={featured}
        pageItems={gridItems}
        totalCount={gridItems.length}
        totalPages={1}
        showFeatured={false}
      />,
    );

    expect(screen.queryByRole('heading', { level: 2, name: '대표 영상' })).not.toBeInTheDocument();
  });

  it('totalPages가 1 이하면 페이저를 렌더하지 않는다', () => {
    render(
      <HighlightsContent
        {...baseProps}
        isLoading={false}
        featured={undefined}
        pageItems={gridItems}
        totalCount={gridItems.length}
        totalPages={1}
      />,
    );

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('totalPages가 2 이상이면 페이저를 렌더한다', () => {
    const goToPage = vi.fn();
    render(
      <HighlightsContent
        {...baseProps}
        isLoading={false}
        featured={undefined}
        pageItems={gridItems}
        totalCount={gridItems.length}
        totalPages={2}
        goToPage={goToPage}
      />,
    );

    expect(screen.getByRole('navigation', { name: '페이지 네비게이션' })).toBeInTheDocument();
  });
});
