/**
 * NewsPage 통합 테스트 (#36).
 *
 * - 최초 로딩 후 첫 페이지 기사와 헤더가 렌더된다.
 * - '기사 더 보기'로 다음 페이지가 이어붙고, 끝나면 버튼이 사라진다.
 * - 기사가 없으면 빈 상태가 렌더된다.
 *
 * fetchDelayMs=0 + 주입 소스로 결정적으로 만든다. Nav/Footer는 app/layout 소관이라 기대하지 않는다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { NewsPage } from '@pages/news';
import { getNewsPage } from '@pages/news/model';
import type { NewsItem, NewsQuery } from '@pages/news/model';

afterEach(cleanup);

const makeNewsItems = (count: number): NewsItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `기사 ${i + 1}`,
    description: `본문 ${i + 1}`,
    link: `https://news.example.com/${i + 1}`,
    originalLink: `o${i + 1}`,
    publishedAt: `2025-03-${String(i + 1).padStart(2, '0')}T00:00`,
  }));

const sourceFrom = (list: NewsItem[]) => (query: NewsQuery) => getNewsPage(query, list);

describe('NewsPage', () => {
  it('최초 로딩 후 첫 페이지 기사와 제목을 렌더한다', async () => {
    render(<NewsPage source={sourceFrom(makeNewsItems(4))} pageSize={2} fetchDelayMs={0} />);

    expect(screen.getByRole('heading', { level: 1, name: '기사' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
  });

  it('더 보기로 다음 페이지를 이어붙이고, 끝나면 버튼이 사라진다', async () => {
    const user = userEvent.setup();
    render(<NewsPage source={sourceFrom(makeNewsItems(4))} pageSize={2} fetchDelayMs={0} />);

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
    await user.click(screen.getByRole('button', { name: '기사 더 보기' }));

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(4));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /더 보기/ })).not.toBeInTheDocument(),
    );
  });

  it('기사가 없으면 빈 상태를 렌더한다', async () => {
    render(<NewsPage source={sourceFrom([])} pageSize={2} fetchDelayMs={0} />);

    await waitFor(() => expect(screen.getByText('표시할 기사가 없어요')).toBeInTheDocument());
  });
});
