/**
 * newsServerQueries 테스트 (AD-1·AD-4·AD-2).
 *
 * - 서버 언랩(ServerApiResult → NewsListDTO) 성공/실패(reject) 동작
 * - newsQueries(클라이언트)와 queryKey·initialPageParam·getNextPageParam·staleTime을
 *   물리적으로 공유함(AD-2)을 identity 수준으로 증명 — getNextPageParam은 toBe(동일 함수 참조)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

import { newsServerQueries } from '@features/news/api/newsServerQueries';
import { newsQueries } from '@features/news/api';
import { fetchNewsList } from '@entities/news/api/server';
import type { NewsListDTO } from '@entities/news/model';

vi.mock('@entities/news/api/server', () => ({
  fetchNewsList: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { wrapper };
};

const makeNewsList = (): NewsListDTO => ({
  newsList: [
    {
      id: 1,
      title: 'title-1',
      description: 'description-1',
      link: 'https://example.com/1',
      originalLink: 'https://example.com/original/1',
      publishedAt: '2026-01-01T00:00',
    },
  ],
  nextCursorAt: null,
  nextCursorId: null,
});

describe('newsServerQueries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchNewsList(server) 성공 시 ServerApiResult를 언랩해 NewsListDTO를 반환한다', async () => {
    const list = makeNewsList();
    vi.mocked(fetchNewsList).mockResolvedValue({ isSuccess: true, status: 200, data: list });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useInfiniteQuery(newsServerQueries.infiniteList()), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.pages[0]).toEqual(list);
  });

  it('fetchNewsList(server)가 isSuccess:false를 반환하면 쿼리가 실패(reject)로 전이한다', async () => {
    vi.mocked(fetchNewsList).mockResolvedValue({
      isSuccess: false,
      status: 502,
      data: { code: 'INVALID_RESPONSE_SCHEMA', message: '스키마 불일치' },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useInfiniteQuery(newsServerQueries.infiniteList()), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('서버/클라이언트 쿼리 옵션이 queryKey·initialPageParam·getNextPageParam·staleTime을 물리적으로 공유한다(AD-2)', () => {
    const serverOptions = newsServerQueries.infiniteList();
    const clientOptions = newsQueries.infiniteList();

    expect(serverOptions.queryKey).toEqual(clientOptions.queryKey);
    expect(serverOptions.initialPageParam).toEqual(clientOptions.initialPageParam);
    expect(serverOptions.getNextPageParam).toBe(clientOptions.getNextPageParam);
    expect(serverOptions.staleTime).toBe(clientOptions.staleTime);
  });

  it('newsServerQueries는 클라이언트 배럴에 재노출되지 않는다(AD-1/S-6)', async () => {
    const barrel = await import('@features/news/api');
    expect(Object.keys(barrel)).not.toContain('newsServerQueries');
  });
});
