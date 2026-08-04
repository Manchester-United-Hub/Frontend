/**
 * premierLeagueRankQueries 단위 테스트.
 *
 * 검증 목적:
 * - rank()의 queryKey가 rankKeys.pl()과 일치한다
 * - queryFn이 BffApiResponse를 언래핑해 Standing[]을 반환한다 (success:true)
 * - queryFn이 success:false 응답을 Error로 승격시킨다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { premierLeagueRankQueries } from '@features/rank/api/premierLeagueRankQueries';
import { rankKeys } from '@features/rank/api/rankKeys';
import { fetchPremierLeagueRankList } from '@entities/rank/api';
import type { Standing } from '@entities/rank/model';

vi.mock('@entities/rank/api', () => ({
  fetchPremierLeagueRankList: vi.fn(),
}));

type QueryFnContext = Parameters<
  NonNullable<ReturnType<typeof premierLeagueRankQueries.rank>['queryFn']>
>[0];

const callQueryFn = () => {
  const { queryFn } = premierLeagueRankQueries.rank();
  return (queryFn as (context: QueryFnContext) => Promise<unknown>)(
    {} as QueryFnContext
  );
};

describe('premierLeagueRankQueries.rank', () => {
  beforeEach(() => vi.clearAllMocks());

  it('queryKey로 rankKeys.pl()을 쓴다', () => {
    expect(premierLeagueRankQueries.rank().queryKey).toEqual(rankKeys.pl());
  });

  it('success:true면 언래핑된 배열을 반환한다', async () => {
    const standings = [{ pos: 1 }] as unknown as Standing[];
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue({
      success: true,
      data: standings,
      error: null,
    });

    const result = await callQueryFn();

    expect(fetchPremierLeagueRankList).toHaveBeenCalledOnce();
    expect(result).toBe(standings);
  });

  it('success:false면 throw한다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'BFF_ERROR', message: '순위표를 불러오지 못했어요' },
    });

    await expect(callQueryFn()).rejects.toThrow('순위표를 불러오지 못했어요');
  });
});
