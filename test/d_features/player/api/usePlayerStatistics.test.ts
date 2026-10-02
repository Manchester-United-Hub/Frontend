/**
 * usePlayerStatistics 훅 단위 테스트.
 *
 * 검증 목적:
 * - getPlayerStatistics 응답을 언랩(D-25)해 data로 노출한다
 * - playerKeys.statistics(playerId, season) 키로 캐시에 저장한다
 * - BFF success:false 응답이면 throw되어 isError로 전이한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { usePlayerStatistics } from '@features/player/api/usePlayerStatistics';
import { playerKeys } from '@features/player/api/playerKeys';
import { getPlayerStatistics } from '@entities/player/api/client';

vi.mock('@entities/player/api/client', () => ({
  getPlayerStatistics: vi.fn(),
}));

const playerId = 1485;
const season = 2025;
const statisticsData = [{ leagueId: 39, leagueName: 'Premier League' }];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { queryClient, wrapper };
};

describe('usePlayerStatistics', () => {
  beforeEach(() => vi.clearAllMocks());

  it('success 응답을 언랩해 data로 노출한다', async () => {
    vi.mocked(getPlayerStatistics).mockResolvedValue({
      success: true,
      data: statisticsData,
      error: null,
    } as unknown as Awaited<ReturnType<typeof getPlayerStatistics>>);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePlayerStatistics(playerId, season), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPlayerStatistics).toHaveBeenCalledWith(playerId, { season });
    expect(result.current.data).toEqual(statisticsData);
  });

  it('playerKeys.statistics(playerId, season) 키로 캐시에 저장한다', async () => {
    vi.mocked(getPlayerStatistics).mockResolvedValue({
      success: true,
      data: statisticsData,
      error: null,
    } as unknown as Awaited<ReturnType<typeof getPlayerStatistics>>);
    const { queryClient, wrapper } = createWrapper();

    const { result } = renderHook(() => usePlayerStatistics(playerId, season), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(playerKeys.statistics(playerId, season))).toEqual(
      statisticsData
    );
  });

  it('success:false 응답이면 isError로 전이한다', async () => {
    vi.mocked(getPlayerStatistics).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: '선수를 찾을 수 없습니다.' },
    } as unknown as Awaited<ReturnType<typeof getPlayerStatistics>>);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePlayerStatistics(playerId, season), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
