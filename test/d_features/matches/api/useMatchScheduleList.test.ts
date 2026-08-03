/**
 * useMatchScheduleList 훅 단위 테스트.
 *
 * 검증 목적:
 * - getMatchScheduleList 응답을 언래핑해 data(Match[])로 노출한다
 * - matchesKeys.schedules() 키로 캐시에 저장한다
 * - BFF success:false 응답이면 isError로 전이한다 (T-1)
 * - 요청 자체가 실패해도 isError로 전이한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useMatchScheduleList } from '@features/matches/api/useMatchScheduleList';
import { matchesKeys } from '@features/matches/api/matchesKeys';
import { getMatchScheduleList } from '@entities/matches/api';
import type { Match } from '@entities/matches/model';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

const matches = [{ id: '1' }] as unknown as Match[];

const scheduleResponse = {
  success: true as const,
  data: matches,
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

describe('useMatchScheduleList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('data가 배열이다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(scheduleResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMatchScheduleList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getMatchScheduleList).toHaveBeenCalledOnce();
    expect(result.current.data).toBe(matches);
  });

  it('matchesKeys.schedules() 키로 캐시에 저장한다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(scheduleResponse);
    const { queryClient, wrapper } = createWrapper();

    const { result } = renderHook(() => useMatchScheduleList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(matchesKeys.schedules())).toBe(matches);
  });

  it('BFF success:false 응답이면 isError로 전이한다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'BFF_ERROR', message: '경기 일정을 불러오지 못했어요' },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMatchScheduleList(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error?.message).toBe(
      '경기 일정을 불러오지 못했어요'
    );
  });

  it('요청이 실패하면 isError로 전이한다', async () => {
    vi.mocked(getMatchScheduleList).mockRejectedValue(
      new Error('network error')
    );
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMatchScheduleList(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
