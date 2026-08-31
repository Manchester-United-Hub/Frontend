/**
 * useNewsFeed 어댑터 테스트 (NW-3/D-9 — react-query 전환).
 *
 * useNewsFeed는 이제 d_features/news의 useNewsInfiniteList(react-query)를 감싸는 얇은
 * 어댑터다. 목 소스 주입(source/delayMs) 대신 e_entities 클라이언트 함수(getNewsList)를
 * vi.mock으로 대체해 검증한다(AD-7, matches 컨벤션 미러링 — test/d_features/news/api의
 * useNewsInfiniteList.test.ts와 동일 패턴).
 *
 * 검증 목적:
 * - 최초 로딩 후 여러 페이지(data.pages)가 newsItems 하나로 평탄화된다
 * - fetchNextPage 호출 시 다음 페이지가 이어붙는다
 * - 요청 실패 시 isError=true로 전이한다
 * - fetchNextPage()의 반환 타입은 void다(react-query의 Promise 반환을 감싼다)
 * - refetch가 노출되고 호출 시 getNewsList가 재요청된다(M-1, decision-2.md §4)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useNewsFeed } from '@pages/news/model';
import { getNewsList } from '@entities/news/api/client';
import type { NewsDTO, NewsListDTO } from '@entities/news/model';

vi.mock('@entities/news/api/client', () => ({
  getNewsList: vi.fn(),
}));

const makeNewsItem = (id: number): NewsDTO => ({
  id,
  title: `title-${id}`,
  description: `description-${id}`,
  link: `https://example.com/${id}`,
  originalLink: `https://example.com/original/${id}`,
  publishedAt: '2026-01-01T00:00',
});

const successResponse = (data: NewsListDTO) => ({ success: true, data, error: null }) as const;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { wrapper };
};

describe('useNewsFeed', () => {
  beforeEach(() => vi.clearAllMocks());

  it('최초 로딩 후 첫 페이지를 newsItems로 노출한다', async () => {
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({
        newsList: [makeNewsItem(2), makeNewsItem(1)],
        nextCursorAt: '2026-01-01T00:00',
        nextCursorId: 1,
      }),
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsFeed({ pageSize: 10 }), { wrapper });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.newsItems).toHaveLength(2);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('fetchNextPage로 다음 페이지가 newsItems에 이어붙는다', async () => {
    vi.mocked(getNewsList)
      .mockResolvedValueOnce(
        successResponse({ newsList: [makeNewsItem(2)], nextCursorAt: '2026-01-01T00:00', nextCursorId: 1 }),
      )
      .mockResolvedValueOnce(
        successResponse({ newsList: [makeNewsItem(1)], nextCursorAt: '2025-12-31T00:00', nextCursorId: 0 }),
      );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsFeed(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.newsItems).toHaveLength(1);

    const returned = result.current.fetchNextPage();
    expect(returned).toBeUndefined();

    await waitFor(() => expect(result.current.newsItems).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('요청이 실패하면 isError=true, newsItems는 빈 배열이다', async () => {
    vi.mocked(getNewsList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsFeed(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.newsItems).toEqual([]);
  });

  it('refetch 호출 시 getNewsList가 다시 호출된다(void 반환)', async () => {
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({
        newsList: [makeNewsItem(1)],
        nextCursorAt: '2026-01-01T00:00',
        nextCursorId: 0,
      }),
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsFeed(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getNewsList).toHaveBeenCalledTimes(1);

    const returned = result.current.refetch();
    expect(returned).toBeUndefined();

    await waitFor(() => expect(getNewsList).toHaveBeenCalledTimes(2));
  });
});
