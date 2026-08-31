/**
 * getPremierLeagueRank 단위 테스트.
 *
 * 검증 목적:
 * - 응답을 ServerApiResult 형태로 반환한다
 * - season 없이 호출하면 serverFetcher.get이 (path, undefined) 2-인자로 불린다 (레거시 하위호환)
 * - season을 넘기면 실제 쿼리({ season })가 serverFetcher.get에 그대로 실린다 (D-4)
 * - 요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API_PATH, serverFetcher } from '@shared/api';
import { getPremierLeagueRank } from '@entities/rank/api/server/fetchPremierLeagueRank';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

describe('getPremierLeagueRank', () => {
  beforeEach(() => vi.clearAllMocks());

  it('응답을 ServerApiResult 형태로 반환한다', async () => {
    const data = {
      season: '2025-26',
      ranks: [
        {
          rank: 1,
          teamId: 33,
          teamName: 'Manchester United',
          teamLogo: 'https://example.com/mun.png',
          points: 70,
          played: 30,
          win: 22,
          draw: 4,
          lose: 4,
          goalsFor: 60,
          goalsAgainst: 25,
          goalsDiff: 35,
          form: 'WWDWL',
        },
      ],
    };
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await getPremierLeagueRank();

    expect(serverFetcher.get).toHaveBeenCalledWith(
      API_PATH.plRank(),
      undefined
    );
    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(data);
  });

  it('season을 넘기면 실제 쿼리에 season이 실린다 (D-4 단일 조립 지점)', async () => {
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ season: '2025-26', ranks: [] }),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await getPremierLeagueRank({ season: 2026 });

    expect(serverFetcher.get).toHaveBeenCalledWith(API_PATH.plRank(), {
      season: 2026,
    });
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'SERVER_ERROR', message: '서버 오류' };
    const mockRes = {
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue(errorData),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await getPremierLeagueRank();

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(500);
    expect(result.data).toEqual(errorData);
  });
});
