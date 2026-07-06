import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';

import { getNewsPage, useNewsArticles } from '@pages/newsArticle/model';
import type { ArticleItem, NewsQuery } from '@pages/newsArticle/model';

const makeItems = (count: number): ArticleItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `t${i + 1}`,
    description: 'd',
    link: 'l',
    originalLink: 'o',
    publishedAt: `2025-02-${String(i + 1).padStart(2, '0')}T00:00`,
  }));

const sourceFrom = (list: ArticleItem[]) => (query: NewsQuery) => getNewsPage(query, list);

describe('useNewsArticles', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('최초 로딩 후 첫 페이지를 노출한다', () => {
    const { result } = renderHook(() =>
      useNewsArticles({ source: sourceFrom(makeItems(5)), pageSize: 2, delayMs: 100 }),
    );

    expect(result.current.isLoading).toBe(true);
    act(() => vi.advanceTimersByTime(100));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.articles).toHaveLength(2);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('fetchNextPage로 다음 페이지를 이어붙이고 끝에서 hasNextPage=false', () => {
    const { result } = renderHook(() =>
      useNewsArticles({ source: sourceFrom(makeItems(5)), pageSize: 2, delayMs: 100 }),
    );
    act(() => vi.advanceTimersByTime(100));

    act(() => result.current.fetchNextPage());
    expect(result.current.isFetchingNextPage).toBe(true);
    act(() => vi.advanceTimersByTime(100));
    expect(result.current.articles).toHaveLength(4);

    act(() => result.current.fetchNextPage());
    act(() => vi.advanceTimersByTime(100));
    expect(result.current.articles).toHaveLength(5);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('빈 소스는 로딩 후 빈 결과·hasNextPage=false', () => {
    const { result } = renderHook(() =>
      useNewsArticles({ source: sourceFrom([]), pageSize: 2, delayMs: 100 }),
    );
    act(() => vi.advanceTimersByTime(100));

    expect(result.current.articles).toEqual([]);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('다음 페이지가 없으면 fetchNextPage는 무시된다', () => {
    const { result } = renderHook(() =>
      useNewsArticles({ source: sourceFrom([]), pageSize: 2, delayMs: 100 }),
    );
    act(() => vi.advanceTimersByTime(100));

    act(() => result.current.fetchNextPage());
    expect(result.current.isFetchingNextPage).toBe(false);
  });
});
