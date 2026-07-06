import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { NewsGrid } from '@pages/newsArticle/ui/NewsGrid';
import type { ArticleItem } from '@pages/newsArticle/model';

afterEach(cleanup);

const articles: ArticleItem[] = [
  { id: 2, title: 'B', description: 'b', link: 'lb', originalLink: 'ob', publishedAt: '2025-05-18T00:00' },
  {
    id: 1,
    title: 'A',
    description: 'a',
    link: 'la',
    originalLink: 'oa',
    publishedAt: '2025-01-04T00:00',
    imageUrl: 'x.jpg',
  },
];

describe('NewsGrid', () => {
  it('기사마다 카드(listitem)를 렌더하고 발행일을 포맷한다', () => {
    render(<NewsGrid articles={articles} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('2025.05.18')).toBeInTheDocument();
    expect(screen.getByText('2025.01.04')).toBeInTheDocument();
  });
});
