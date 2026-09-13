/**
 * matchServerQueries 테스트 (D-7 회귀 가드).
 *
 * - 서버 언랩(getLandingMatches → null이면 throw) 성공/실패 동작
 * - matchQueries(클라이언트)와 queryKey·staleTime을 물리적으로 공유함을 단언 — 키가 갈라지면
 *   하이드레이션 후 클라이언트가 조용히 재조회하고 첫 페인트가 스켈레톤으로 되돌아간다(D-7).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import React from 'react';

import { matchServerQueries } from '@features/matches/api/matchServerQueries';
import { matchQueries } from '@features/matches/api/matchQueries';
import { getLandingMatches } from '@entities/matches/api/server/getLandingMatches';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

vi.mock('@entities/matches/api/server/getLandingMatches', () => ({
  getLandingMatches: vi.fn(),
}));

vi.mock('@entities/matches/api/client', () => ({
  getLandingMatchesViaBff: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return { wrapper };
};

const makeLandingMatches = (): LandingMatches => ({
  recent: null,
  next: null,
});

describe('matchServerQueries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getLandingMatches 성공 시 LandingMatches를 그대로 반환한다', async () => {
    const data = makeLandingMatches();
    vi.mocked(getLandingMatches).mockResolvedValue(data);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useQuery(matchServerQueries.landing()), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it('getLandingMatches가 null을 반환하면 쿼리가 실패(reject)로 전이한다', async () => {
    vi.mocked(getLandingMatches).mockResolvedValue(null);
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useQuery(matchServerQueries.landing()), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('서버(matchServerQueries)·클라이언트(matchQueries)가 물리적으로 동일한 queryKey를 만든다(D-7)', () => {
    const serverOptions = matchServerQueries.landing();
    const clientOptions = matchQueries.landing();

    expect(serverOptions.queryKey).toEqual(clientOptions.queryKey);
    expect(serverOptions.queryKey).toEqual(['matches', 'landing']);
  });

  it('staleTime도 서버·클라이언트가 동일하다(300_000, D-7)', () => {
    const serverOptions = matchServerQueries.landing();
    const clientOptions = matchQueries.landing();

    expect(serverOptions.staleTime).toBe(300_000);
    expect(clientOptions.staleTime).toBe(300_000);
  });

  it('matchServerQueries는 클라이언트 배럴에 재노출되지 않는다(D-10)', async () => {
    const barrel = await import('@features/matches/api');
    expect(Object.keys(barrel)).not.toContain('matchServerQueries');
  });
});
