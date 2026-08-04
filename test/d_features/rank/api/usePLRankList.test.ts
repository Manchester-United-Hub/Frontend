/**
 * usePLRankList 훅 단위 테스트.
 *
 * 검증 목적:
 * - fetchPremierLeagueRankList 응답을 언래핑해 data(Standing[])로 노출한다
 * - rankKeys.pl() 키로 캐시에 저장한다
 * - BFF success:false 응답이면 isError로 전이한다
 * - 요청 자체가 실패해도 isError로 전이한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { usePLRankList } from '@features/rank/api/usePLRankList';
import { rankKeys } from '@features/rank/api/rankKeys';
import { fetchPremierLeagueRankList } from '@entities/rank/api';
import type { Standing } from '@entities/rank/model';

vi.mock('@entities/rank/api', () => ({
  fetchPremierLeagueRankList: vi.fn(),
}));

const standings = [{ pos: 1 }] as unknown as Standing[];

const rankResponse = {
  success: true as const,
  data: standings,
  error: null,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { queryClient, wrapper };
};

describe('usePLRankList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('data가 배열이다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue(rankResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePLRankList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchPremierLeagueRankList).toHaveBeenCalledOnce();
    expect(result.current.data).toBe(standings);
  });

  it('rankKeys.pl() 키로 캐시에 저장한다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue(rankResponse);
    const { queryClient, wrapper } = createWrapper();

    const { result } = renderHook(() => usePLRankList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(rankKeys.pl())).toBe(standings);
  });

  it('BFF success:false 응답이면 isError로 전이한다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'BFF_ERROR', message: '순위표를 불러오지 못했어요' },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePLRankList(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error?.message).toBe('순위표를 불러오지 못했어요');
  });

  it('요청이 실패하면 isError로 전이한다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockRejectedValue(
      new Error('network error')
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePLRankList(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
