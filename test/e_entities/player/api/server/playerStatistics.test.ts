import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher } from '@shared/api';
import { fetchPlayerStatistics } from '@entities/player/api/server/playerStatistics';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

const playerId = 1485;
const validQuery = { season: 2025 };

describe('fetchPlayerStatistics', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/player-details/{playerId} 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ player: {}, statistics: [] }),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await fetchPlayerStatistics(playerId, validQuery);

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/player-details/1485', validQuery);
  });

  it('응답에서 statistics 배열만 추출해 ServerApiResult로 반환한다', async () => {
    const statistics = [{ leagueId: 39, leagueName: 'Premier League' }];
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ player: { id: playerId }, statistics }),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchPlayerStatistics(playerId, validQuery);

    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(statistics);
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'SERVER_ERROR', message: '서버 오류' };
    const mockRes = { ok: false, status: 500, json: vi.fn().mockResolvedValue(errorData) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchPlayerStatistics(playerId, validQuery);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(500);
    expect(result.data).toEqual(errorData);
  });
});
