/**
 * NewsPage 통합 테스트 (NW-3/D-9 — react-query 전환).
 *
 * useNewsFeed가 useNewsInfiniteList(react-query) 어댑터로 바뀌면서, source/pageSize/
 * fetchDelayMs props 주입 방식 대신 e_entities 클라이언트 함수(getNewsList)를
 * vi.mock으로 대체하는 방식으로 전환한다(AD-7, matches 컨벤션 미러링).
 *
 * - 최초 로딩 후 첫 페이지 기사와 헤더가 렌더된다.
 * - '기사 더 보기'로 다음 페이지가 이어붙고, 끝나면 버튼이 사라진다.
 * - 기사가 없으면 빈 상태가 렌더된다.
 * - 요청 실패 시 에러 상태가 렌더된다.
 * - 에러 상태에서 '다시 시도' 클릭 시 refetch가 실제로 재조회를 트리거한다(M-1, decision-2.md §4).
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import React from 'react';

import { NewsPage } from '@pages/news';
import { getNewsList } from '@entities/news/api/client';
import type { NewsDTO, NewsListDTO } from '@entities/news/model';

vi.mock('@entities/news/api/client', () => ({
  getNewsList: vi.fn(),
}));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

const makeNewsItem = (id: number): NewsDTO => ({
  id,
  title: `기사 ${id}`,
  description: `본문 ${id}`,
  link: `https://news.example.com/${id}`,
  originalLink: `o${id}`,
  publishedAt: `2025-03-${String(id).padStart(2, '0')}T00:00`,
});

const successResponse = (data: NewsListDTO) => ({ success: true, data, error: null }) as const;

const renderNewsPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    React.createElement(QueryClientProvider, { client: queryClient }, React.createElement(NewsPage)),
  );
};

describe('NewsPage', () => {
  it('최초 로딩 후 첫 페이지 기사와 제목을 렌더한다', async () => {
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({
        newsList: [makeNewsItem(2), makeNewsItem(1)],
        nextCursorAt: '2025-03-01T00:00',
        nextCursorId: 0,
      }),
    );

    renderNewsPage();

    expect(screen.getByRole('heading', { level: 1, name: '기사' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
  });

  it('더 보기로 다음 페이지를 이어붙이고, 끝나면 버튼이 사라진다', async () => {
    const user = userEvent.setup();
    vi.mocked(getNewsList)
      .mockResolvedValueOnce(
        successResponse({
          newsList: [makeNewsItem(2)],
          nextCursorAt: '2025-03-02T00:00',
          nextCursorId: 2,
        }),
      )
      .mockResolvedValueOnce(
        successResponse({
          newsList: [makeNewsItem(1)],
          nextCursorAt: '2025-03-01T00:00',
          nextCursorId: 0,
        }),
      );

    renderNewsPage();

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1));
    await user.click(screen.getByRole('button', { name: '기사 더 보기' }));

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /더 보기/ })).not.toBeInTheDocument(),
    );
  });

  it('기사가 없으면 빈 상태를 렌더한다', async () => {
    vi.mocked(getNewsList).mockResolvedValue(
      successResponse({ newsList: [], nextCursorAt: '9999-12-31T23:59', nextCursorId: 0 }),
    );

    renderNewsPage();

    await waitFor(() => expect(screen.getByText('표시할 기사가 없어요')).toBeInTheDocument());
  });

  it('요청이 실패하면 에러 상태를 렌더한다', async () => {
    vi.mocked(getNewsList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });

    renderNewsPage();

    await waitFor(() => expect(screen.getByText('기사를 불러오지 못했어요')).toBeInTheDocument());
  });

  it('에러 상태에서 다시 시도 클릭 시 refetch가 호출되어 재조회한다(M-1)', async () => {
    const user = userEvent.setup();
    vi.mocked(getNewsList)
      .mockResolvedValueOnce({
        success: false,
        data: null,
        error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
      })
      .mockResolvedValueOnce(
        successResponse({
          newsList: [makeNewsItem(1)],
          nextCursorAt: '2025-03-01T00:00',
          nextCursorId: 0,
        }),
      );

    renderNewsPage();

    await waitFor(() => expect(screen.getByText('기사를 불러오지 못했어요')).toBeInTheDocument());
    expect(getNewsList).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    await waitFor(() => expect(getNewsList).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(1));
  });
});
