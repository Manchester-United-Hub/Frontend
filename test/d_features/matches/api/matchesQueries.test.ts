/**
 * matchesQueries 단위 테스트.
 *
 * 검증 목적:
 * - scheduleList()의 queryKey가 matchesKeys.schedules()와 일치한다
 * - queryFn이 엔티티 계층의 getMatchScheduleList를 호출한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { matchesQueries } from '@features/matches/api/matchesQueries';
import { matchesKeys } from '@features/matches/api/matchesKeys';
import { getMatchScheduleList } from '@entities/matches/api';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

type QueryFnContext = Parameters<
  NonNullable<ReturnType<typeof matchesQueries.scheduleList>['queryFn']>
>[0];

describe('matchesQueries.scheduleList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('queryKey로 matchesKeys.schedules()를 쓴다', () => {
    expect(matchesQueries.scheduleList().queryKey).toEqual(
      matchesKeys.schedules()
    );
  });

  it('queryFn이 getMatchScheduleList를 호출한다', async () => {
    const response = { success: true, data: [], error: null };
    vi.mocked(getMatchScheduleList).mockResolvedValue(
      response as unknown as Awaited<ReturnType<typeof getMatchScheduleList>>
    );

    const { queryFn } = matchesQueries.scheduleList();
    const result = await (
      queryFn as (context: QueryFnContext) => Promise<unknown>
    )({} as QueryFnContext);

    expect(getMatchScheduleList).toHaveBeenCalledOnce();
    expect(result).toBe(response);
  });
});
