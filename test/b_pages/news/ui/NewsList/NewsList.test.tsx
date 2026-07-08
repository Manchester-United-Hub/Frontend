import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { NewsList } from '@pages/news/ui/NewsList';
import type { NewsItem } from '@pages/news/model';

afterEach(cleanup);

const newsItems: NewsItem[] = [
  { id: 2, title: 'B', description: 'b', link: 'lb', originalLink: 'ob', publishedAt: '2025-05-18T00:00' },
  { id: 1, title: 'A', description: 'a', link: 'la', originalLink: 'oa', publishedAt: '2025-01-04T00:00' },
];

describe('NewsList', () => {
  it('기사마다 행(listitem)을 렌더하고 발행일을 포맷한다', () => {
    render(<NewsList newsItems={newsItems} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('2025.05.18')).toBeInTheDocument();
    expect(screen.getByText('2025.01.04')).toBeInTheDocument();
  });
});
