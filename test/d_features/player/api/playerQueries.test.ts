/**
 * playerQueries 단위 테스트 — S-6 정규화(BFF 봉투 언랩 + !success에서 throw) 검증.
 *
 * queryFn을 직접 호출하지 않고 실 QueryClient.fetchQuery로 queryOptions를 그대로 구동한다
 * (TanStack의 QueryFunctionContext를 손으로 만들지 않기 위함 — seasonQueries.current의
 * fetchCurrentSeasonViaBff와 동일한 언랩 형태를 이 경로로 검증한다).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

import { getPlayerList } from '@entities/player/api/client';
import { playerQueries } from '@features/player/api/playerQueries';
import { rosterListQuery } from '@features/player/api/rosterListQuery';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@entities/player/api/client', () => ({
  getPlayerList: vi.fn(),
}));

const START_YEAR = 2026;

describe('playerQueries.list', () => {
  beforeEach(() => {
    vi.mocked(getPlayerList).mockReset();
  });

  it('queryKey는 playerKeys.list(rosterListQuery(startYear))와 동일하다', () => {
    const query = rosterListQuery(START_YEAR);
    const options = playerQueries.list(query);

    expect(options.queryKey).toEqual(['player', 'list', query]);
  });

  it('staleTime은 3_600_000이다(S-8, 리터럴 단언)', () => {
    const options = playerQueries.list(rosterListQuery(START_YEAR));

    expect(options.staleTime).toBe(3_600_000);
  });

  it('success:true 응답이면 BFF 봉투를 언랩해 PlyaerListDTO를 반환한다', async () => {
    const dto = buildPlayerListDTO([buildPlayerDTO()]);
    vi.mocked(getPlayerList).mockResolvedValue({ success: true, data: dto, error: null });
    const queryClient = new QueryClient();

    const result = await queryClient.fetchQuery(playerQueries.list(rosterListQuery(START_YEAR)));

    expect(result).toEqual(dto);
  });

  it('success:false 응답이면 throw해 fetchQuery가 reject된다(AD-1 표준)', async () => {
    vi.mocked(getPlayerList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });
    const queryClient = new QueryClient();

    await expect(
      queryClient.fetchQuery(playerQueries.list(rosterListQuery(START_YEAR)))
    ).rejects.toThrow('서버 오류');
  });
});
