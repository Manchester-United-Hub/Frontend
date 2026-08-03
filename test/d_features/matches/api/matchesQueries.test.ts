/**
 * matchesQueries 단위 테스트.
 *
 * 검증 목적:
 * - scheduleList()의 queryKey가 matchesKeys.schedules()와 일치한다
 * - queryFn이 BffApiResponse를 언래핑해 Match[]를 반환한다 (success:true)
 * - queryFn이 success:false 응답을 Error로 승격시킨다 (T-1)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { matchesQueries } from '@features/matches/api/matchesQueries';
import { matchesKeys } from '@features/matches/api/matchesKeys';
import { getMatchScheduleList } from '@entities/matches/api';
import type { Match } from '@entities/matches/model';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

type QueryFnContext = Parameters<
  NonNullable<ReturnType<typeof matchesQueries.scheduleList>['queryFn']>
>[0];

const callQueryFn = () => {
  const { queryFn } = matchesQueries.scheduleList();
  return (queryFn as (context: QueryFnContext) => Promise<unknown>)(
    {} as QueryFnContext
  );
};

describe('matchesQueries.scheduleList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('queryKey로 matchesKeys.schedules()를 쓴다', () => {
    expect(matchesQueries.scheduleList().queryKey).toEqual(
      matchesKeys.schedules()
    );
  });

  it('success:true면 언래핑된 배열을 반환한다', async () => {
    const matches = [{ id: '1' }] as unknown as Match[];
    vi.mocked(getMatchScheduleList).mockResolvedValue({
      success: true,
      data: matches,
      error: null,
    });

    const result = await callQueryFn();

    expect(getMatchScheduleList).toHaveBeenCalledOnce();
    expect(result).toBe(matches);
  });

  it('success:false면 throw한다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'BFF_ERROR', message: '경기 일정을 불러오지 못했어요' },
    });

    await expect(callQueryFn()).rejects.toThrow(
      '경기 일정을 불러오지 못했어요'
    );
  });
});
