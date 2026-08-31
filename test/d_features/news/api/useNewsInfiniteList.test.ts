/**
 * useNewsInfiniteList 훅 단위 테스트.
 *
 * 검증 목적:
 * - 최초 페이지: 초기 커서(가장 미래 경계값)로 getNewsList를 호출하고 결과를 data.pages[0]로 노출한다
 * - fetchNextPage: 이전 페이지의 nextCursorAt/nextCursorId로 다음 페이지를 요청한다
 * - 마지막 페이지면 hasNextPage가 false다 — 실 API 종료 신호(nextCursorId=null)와
 *   목데이터 시절 센티널(nextCursorId=0)을 모두 종료로 취급한다(리뷰 NW Critical-1 회귀 가드)
 * - 요청 실패(BFF 에러 응답) 시 isError로 전이한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useNewsInfiniteList } from '@features/news/api/useNewsInfiniteList';
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

  return { queryClient, wrapper };
};

describe('useNewsInfiniteList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('최초 페이지를 초기 커서(가장 미래 경계값)로 조회한다', async () => {
    const firstPage: NewsListDTO = {
      newsList: [makeNewsItem(1)],
      nextCursorAt: '2026-01-01T00:00',
      nextCursorId: 1,
    };
    vi.mocked(getNewsList).mockResolvedValue(successResponse(firstPage));
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsInfiniteList(10), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // 9999년은 백엔드에서 500을 유발한다(실 서버 확인) — 수용 가능한 경계값이어야 한다.
    expect(getNewsList).toHaveBeenCalledWith({
      cursorAt: '2999-12-31T23:59',
      cursorId: Number.MAX_SAFE_INTEGER,
      size: 10,
    });
    expect(result.current.data?.pages[0]).toEqual(firstPage);
  });

  it('실 API 종료 신호(nextCursorId=null)를 마지막 페이지로 인식한다', async () => {
    // 실 서버는 마지막 페이지 이후 {newsList: [], nextCursorId: null, nextCursorAt: null}을 반환한다.
    // 0 센티널만 검사하면 hasNextPage가 계속 true로 남아 커서 null로 재요청(400)이 발생한다.
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({
        newsList: [makeNewsItem(1)],
        nextCursorAt: null,
        nextCursorId: null,
      }),
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsInfiniteList(10), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('빈 페이지를 받으면 커서가 남아 있어도 더 요청하지 않는다', async () => {
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({ newsList: [], nextCursorAt: '2026-01-01T00:00', nextCursorId: 5 }),
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsInfiniteList(10), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('fetchNextPage 호출 시 이전 페이지의 커서로 다음 페이지를 요청한다', async () => {
    vi.mocked(getNewsList)
      .mockResolvedValueOnce(
        successResponse({ newsList: [makeNewsItem(2)], nextCursorAt: '2026-01-01T00:00', nextCursorId: 1 })
      )
      .mockResolvedValueOnce(
        successResponse({ newsList: [makeNewsItem(1)], nextCursorAt: '2025-12-31T00:00', nextCursorId: 0 })
      );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsInfiniteList(10), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));

    expect(getNewsList).toHaveBeenLastCalledWith({
      cursorAt: '2026-01-01T00:00',
      cursorId: 1,
      size: 10,
    });
    expect(result.current.hasNextPage).toBe(false);
  });

  it('요청이 실패하면 isError로 전이한다', async () => {
    vi.mocked(getNewsList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useNewsInfiniteList(10), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
