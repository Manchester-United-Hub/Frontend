import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { HighlightsGrid } from '@pages/highlights/ui/HighlightsGrid';
import { buildHighlightItem } from '@test/fixtures/highlights';

afterEach(cleanup);

const items = [
  buildHighlightItem({
    id: 'h2',
    title: 'Leeds 1-1 Man Utd | Highlights',
    watchUrl: 'https://www.youtube.com/watch?v=h2',
  }),
  buildHighlightItem({
    id: 'h3',
    title: 'Man Utd v AC Milan | Full Match',
    watchUrl: 'https://www.youtube.com/watch?v=h3',
  }),
];

describe('HighlightsGrid', () => {
  it('items를 HighlightCard 목록으로 렌더한다', () => {
    render(<HighlightsGrid items={items} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(items.length);
    expect(screen.getByRole('heading', { level: 3, name: items[0].title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: items[1].title })).toBeInTheDocument();
  });

  it('각 카드는 자기 영상의 YouTube 시청 링크를 갖는다', () => {
    render(<HighlightsGrid items={items} />);

    expect(screen.getByRole('link', { name: items[1].title })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=h3',
    );
  });
});
