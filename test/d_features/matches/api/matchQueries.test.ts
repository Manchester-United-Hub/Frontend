/**
 * matchQueries 테스트.
 *
 * getLandingMatchesViaBff(클라이언트 fetch)의 BffApiResponse 언랩(성공/실패) 동작과
 * staleTime을 검증한다. 서버·클라이언트 queryKey 동일성은 두 경로가 모두 필요하므로
 * matchServerQueries.test.ts에서 함께 단언한다(newsServerQueries.test.ts 선례).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import React from 'react';

import { matchQueries } from '@features/matches/api/matchQueries';
import { getLandingMatchesViaBff } from '@entities/matches/api/client';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

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

describe('matchQueries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getLandingMatchesViaBff 성공 시 BffApiResponse를 언랩해 LandingMatches를 반환한다', async () => {
    const data = makeLandingMatches();
    vi.mocked(getLandingMatchesViaBff).mockResolvedValue({ success: true, data, error: null });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useQuery(matchQueries.landing()), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it('getLandingMatchesViaBff가 success:false를 반환하면 쿼리가 실패(reject)로 전이한다', async () => {
    vi.mocked(getLandingMatchesViaBff).mockResolvedValue({
      success: false,
      data: null,
      error: {
        code: 'SCHEDULE_UNAVAILABLE',
        message: 'SCHEDULE_UNAVAILABLE: upstream schedule fetch failed.',
      },
    });
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useQuery(matchQueries.landing()), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it('staleTime은 300_000이다(app/page.tsx revalidate=300과 정합, D-7)', () => {
    expect(matchQueries.landing().staleTime).toBe(300_000);
  });
});
