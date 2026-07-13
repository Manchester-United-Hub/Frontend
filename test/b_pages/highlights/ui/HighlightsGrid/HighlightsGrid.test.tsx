import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightsGrid } from '@pages/highlights/ui/HighlightsGrid';
import type { HighlightItem } from '@pages/highlights/model';

afterEach(cleanup);

const items: HighlightItem[] = [
  {
    id: 'h2',
    title: '브루누 중거리 프리킥',
    category: '골',
    competition: 'FA컵',
    date: '2025.05.11',
    views: '1.8M',
    duration: '0:58',
  },
  {
    id: 'h3',
    title: '오나나 연속 선방',
    category: '세이브',
    competition: '챔피언스리그',
    date: '2025.05.06',
    views: '940K',
    duration: '2:15',
  },
];

describe('HighlightsGrid', () => {
  it('items를 HighlightCard 목록으로 렌더한다', () => {
    render(<HighlightsGrid items={items} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(items.length);
    expect(screen.getByRole('heading', { level: 3, name: items[0].title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: items[1].title })).toBeInTheDocument();
  });

  it('빈 배열이면 StateBox 빈 상태를 렌더한다', () => {
    render(<HighlightsGrid items={[]} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '해당 카테고리 영상이 없어요' }),
    ).toBeInTheDocument();
    expect(screen.getByText('다른 카테고리를 선택해 보세요.')).toBeInTheDocument();
  });
});
