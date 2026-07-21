import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { getLiveMatchLineup } from '@entities/matches/api/client/liveMatchLineup';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

describe('getLiveMatchLineup', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/match/:matchId/lineups 경로로 GET 요청한다', async () => {
    const mockRes = {
      json: vi.fn().mockResolvedValue({}),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await getLiveMatchLineup({ matchId: 12345 });

    expect(clientFetcher.get).toHaveBeenCalledWith(
      '/api/v1/match/12345/lineups'
    );
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = {
      success: true,
      data: { lineups: [] },
      error: null,
    };
    const mockRes = {
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await getLiveMatchLineup({ matchId: 12345 });

    expect(result).toEqual(data);
  });
});
