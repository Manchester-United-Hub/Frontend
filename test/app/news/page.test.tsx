import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';

import News from '@app/news/page';
import { getNewsList } from '@entities/news/api/client';
import type { NewsListDTO } from '@entities/news/model';

// NW-3/D-9 — NewsPage가 react-query(useNewsInfiniteList)를 쓰므로 이 테스트도
// QueryClientProvider로 감싸고 e_entities 클라이언트 함수를 mock한다(AD-7).
vi.mock('@entities/news/api/client', () => ({
  getNewsList: vi.fn(),
}));

afterEach(cleanup);

const successResponse = (data: NewsListDTO) => ({ success: true, data, error: null }) as const;

describe('news route page', () => {
  it('뉴스 기사 페이지(main + 제목 + 기사 목록)를 렌더한다', async () => {
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({
        newsList: [
          {
            id: 1,
            title: '기사 1',
            description: '본문 1',
            link: 'https://news.example.com/1',
            originalLink: 'o1',
            publishedAt: '2025-03-01T00:00',
          },
        ],
        nextCursorAt: '2025-03-01T00:00',
        nextCursorId: 0,
      }),
    );
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <News />
      </QueryClientProvider>,
    );

    expect(container.querySelector('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '기사' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0), {
      timeout: 2000,
    });
  });
});
