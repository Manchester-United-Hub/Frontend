/**
 * useCurrentSeason 훅 단위 테스트.
 *
 * 검증 목적:
 * - 성공 응답의 BFF 봉투를 벗겨 CurrentSeasonDTO를 그대로 노출한다
 * - BFF 에러 봉투(success:false)면 throw해 isError로 전이한다(AD-1 표준 언랩)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useCurrentSeason } from '@features/seasonInfo/api/useCurrentSeason';
import { fetchCurrentSeason } from '@entities/seasonInfo/api/client';

vi.mock('@entities/seasonInfo/api/client', () => ({
  fetchCurrentSeason: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return wrapper;
};

describe('useCurrentSeason', () => {
  beforeEach(() => vi.clearAllMocks());

  it('BFF 봉투를 벗겨 현재 시즌을 노출한다', async () => {
    const currentSeason = { season: 2026, started: true };
    vi.mocked(fetchCurrentSeason).mockResolvedValue({
      success: true,
      data: currentSeason,
      error: null,
    });

    const { result } = renderHook(() => useCurrentSeason(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(currentSeason);
  });

  it('BFF 에러 봉투면 isError로 전이한다', async () => {
    vi.mocked(fetchCurrentSeason).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });

    const { result } = renderHook(() => useCurrentSeason(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('서버 내부 오류입니다.');
  });
});
