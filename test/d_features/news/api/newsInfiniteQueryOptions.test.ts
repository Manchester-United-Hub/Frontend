/**
 * newsInfiniteQueryOptions 팩토리 계약 테스트 (AD-2).
 *
 * queryKey·initialPageParam·getNextPageParam·staleTime은 이 팩토리가 단독 소유하는 계약이다.
 * 기대값은 리터럴로 적는다 — 대상 모듈의 상수를 import해 기대값을 계산하면 그 상수가 검증되지 않는다(S-12).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

import {
  newsInfiniteQueryOptions,
  DEFAULT_NEWS_PAGE_SIZE,
} from '@features/news/api/newsInfiniteQueryOptions';
import type { NewsListDTO } from '@entities/news/model';

const makePage = (overrides: Partial<NewsListDTO> = {}): NewsListDTO => ({
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
  nextCursorAt: '2026-01-01T00:00',
  nextCursorId: 1,
  ...overrides,
});

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { wrapper };
};

describe('newsInfiniteQueryOptions', () => {
  beforeEach(() => vi.clearAllMocks());

  it('DEFAULT_NEWS_PAGE_SIZE는 10이다', () => {
    expect(DEFAULT_NEWS_PAGE_SIZE).toBe(10);
  });

  it('무인자 호출 시 queryKey가 기본 페이지 크기(10)로 고정된다', () => {
    const options = newsInfiniteQueryOptions(vi.fn());

    expect(options.queryKey).toEqual(['news', 'infiniteList', { size: 10 }]);
  });

  it('initialPageParam은 최초 커서 센티널이다', () => {
    const options = newsInfiniteQueryOptions(vi.fn());

    expect(options.initialPageParam).toEqual({
      cursorAt: '2999-12-31T23:59',
      cursorId: Number.MAX_SAFE_INTEGER,
    });
  });

  it('staleTime은 60_000ms다', () => {
    const options = newsInfiniteQueryOptions(vi.fn());

    expect(options.staleTime).toBe(60_000);
  });

  it('queryFn이 주입된 fetchPage에 pageParam과 size를 합쳐 전달한다', async () => {
    const fetchPage = vi.fn().mockResolvedValue(makePage());
    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useInfiniteQuery(newsInfiniteQueryOptions(fetchPage, 5)),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchPage).toHaveBeenCalledWith({
      cursorAt: '2999-12-31T23:59',
      cursorId: Number.MAX_SAFE_INTEGER,
      size: 5,
    });
  });

  describe('getNextPageParam', () => {
    it('정상 커서면 다음 pageParam을 반환한다', () => {
      const options = newsInfiniteQueryOptions(vi.fn());
      const lastPage = makePage({ nextCursorAt: '2026-01-01T00:00', nextCursorId: 1 });

      const nextParam = options.getNextPageParam(lastPage, [lastPage], options.initialPageParam, [
        options.initialPageParam,
      ]);

      expect(nextParam).toEqual({ cursorAt: '2026-01-01T00:00', cursorId: 1 });
    });

    it('nextCursorId가 null이면(종료 신호) undefined를 반환한다', () => {
      const options = newsInfiniteQueryOptions(vi.fn());
      const lastPage = makePage({ nextCursorAt: null, nextCursorId: null });

      const nextParam = options.getNextPageParam(lastPage, [lastPage], options.initialPageParam, [
        options.initialPageParam,
      ]);

      expect(nextParam).toBeUndefined();
    });

    it('빈 newsList면 커서가 남아 있어도 undefined를 반환한다(무한 요청 방지)', () => {
      const options = newsInfiniteQueryOptions(vi.fn());
      const lastPage = makePage({ newsList: [], nextCursorAt: '2026-01-01T00:00', nextCursorId: 1 });

      const nextParam = options.getNextPageParam(lastPage, [lastPage], options.initialPageParam, [
        options.initialPageParam,
      ]);

      expect(nextParam).toBeUndefined();
    });
  });
});
