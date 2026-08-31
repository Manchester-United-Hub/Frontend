/**
 * usePlayerProfile 훅 단위 테스트.
 *
 * 검증 목적:
 * - getPlayerProfile 응답을 언랩(D-25)해 data로 노출한다
 * - playerKeys.profile(playerId, season) 키로 캐시에 저장한다
 * - BFF success:false 응답이면 throw되어 isError로 전이한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { usePlayerProfile } from '@features/player/api/usePlayerProfile';
import { playerKeys } from '@features/player/api/playerKeys';
import { getPlayerProfile } from '@entities/player/api/client';

vi.mock('@entities/player/api/client', () => ({
  getPlayerProfile: vi.fn(),
}));

const playerId = 1485;
const season = 2025;
const profileData = { id: playerId, name: 'Bruno Fernandes' };

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { queryClient, wrapper };
};

describe('usePlayerProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('success 응답을 언랩해 data로 노출한다', async () => {
    vi.mocked(getPlayerProfile).mockResolvedValue({
      success: true,
      data: profileData,
      error: null,
    } as unknown as Awaited<ReturnType<typeof getPlayerProfile>>);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePlayerProfile(playerId, season), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getPlayerProfile).toHaveBeenCalledWith(playerId, { season });
    expect(result.current.data).toEqual(profileData);
  });

  it('playerKeys.profile(playerId, season) 키로 캐시에 저장한다', async () => {
    vi.mocked(getPlayerProfile).mockResolvedValue({
      success: true,
      data: profileData,
      error: null,
    } as unknown as Awaited<ReturnType<typeof getPlayerProfile>>);
    const { queryClient, wrapper } = createWrapper();

    const { result } = renderHook(() => usePlayerProfile(playerId, season), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.getQueryData(playerKeys.profile(playerId, season))).toEqual(profileData);
  });

  it('success:false 응답이면 isError로 전이한다', async () => {
    vi.mocked(getPlayerProfile).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: '선수를 찾을 수 없습니다.' },
    } as unknown as Awaited<ReturnType<typeof getPlayerProfile>>);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => usePlayerProfile(playerId, season), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
