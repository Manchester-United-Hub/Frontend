import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';

import News from '@app/news/page';
import { fetchNewsList } from '@entities/news/api/server';
import { getNewsList } from '@entities/news/api/client';
import type { NewsListDTO } from '@entities/news/model';

/**
 * NWS-2/AD-6 — News가 async 서버 컴포넌트(prefetchInfiniteQuery + dehydrate/HydrationBoundary)로
 * 바뀌었으므로, 서버 경로(@entities/news/api/server)와 클라이언트 경로(@entities/news/api/client)를
 * 모두 mock하고 `render(<QueryClientProvider>{await News()}</QueryClientProvider>)`로 렌더한다.
 */
vi.mock('@entities/news/api/server', () => ({
  fetchNewsList: vi.fn(),
}));
vi.mock('@entities/news/api/client', () => ({
  getNewsList: vi.fn(),
}));

afterEach(cleanup);

const makeNewsList = (): NewsListDTO => ({
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
});

const bffSuccessResponse = (data: NewsListDTO) => ({ success: true, data, error: null }) as const;

const renderNews = async () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

  return render(<QueryClientProvider client={queryClient}>{await News()}</QueryClientProvider>);
};

describe('news route page', () => {
  beforeEach(() => vi.clearAllMocks());

  it('A-1: 서버 프리페치가 성공하면 초기 렌더에서 곧바로 기사가 보이고 클라이언트가 다시 페칭하지 않는다', async () => {
    vi.mocked(fetchNewsList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: makeNewsList(),
    });

    const { container } = await renderNews();

    // waitFor 없이 동기 단언 — hydration이 성립하지 않으면(queryKey·initialPageParam이
    // 어긋나면) 이 시점에 목록이 비어 있거나 스켈레톤만 보인다.
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: '기사' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
    expect(screen.getByText('기사 1')).toBeInTheDocument();
    // staleTime(60_000ms) 안이므로 클라이언트가 마운트 시 재페칭하지 않는다 — hydration 성립의 증거.
    expect(getNewsList).not.toHaveBeenCalled();
  });

  it('A-2: 서버 프리페치가 실패해도 페이지는 throw하지 않고 클라이언트가 이어받는다(graceful degradation, AD-4)', async () => {
    vi.mocked(fetchNewsList).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });
    vi.mocked(getNewsList).mockResolvedValue(bffSuccessResponse(makeNewsList()));

    await renderNews();

    // 실패한 쿼리는 dehydrate 대상에서 제외되므로(AD-4 assumption A-1) 초기 렌더에는
    // 기사가 없다(스켈레톤 구간) — 페이지 자체는 throw하지 않고 여기까지 렌더된다.
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);

    await waitFor(() => expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0));
    expect(getNewsList).toHaveBeenCalled();
  });
});
