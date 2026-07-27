/**
 * useMatchScheduleList 훅 단위 테스트.
 *
 * 검증 목적:
 * - getMatchScheduleList 응답을 data로 노출한다
 * - matchesKeys.schedules() 키로 캐시에 저장한다
 * - 요청 실패 시 isError로 전이한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useMatchScheduleList } from '@features/matches/api/useMatchScheduleList';
import { matchesKeys } from '@features/matches/api/matchesKeys';
import { getMatchScheduleList } from '@entities/matches/api';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

const scheduleResponse = {
  success: true,
  data: [{ matchId: 1 }],
  error: null,
} as unknown as Awaited<ReturnType<typeof getMatchScheduleList>>;

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

  it('getMatchScheduleList 응답을 data로 노출한다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(scheduleResponse);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useMatchScheduleList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getMatchScheduleList).toHaveBeenCalledOnce();
    expect(result.current.data).toBe(scheduleResponse);
  });

  it('matchesKeys.schedules() 키로 캐시에 저장한다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(scheduleResponse);
    const { queryClient, wrapper } = createWrapper();

    const { result } = renderHook(() => useMatchScheduleList(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(matchesKeys.schedules())).toBe(
      scheduleResponse
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
