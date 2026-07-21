import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { getPastMatchDetail } from '@entities/matches/api/client/pastMatchDetail';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

describe('getPastMatchDetail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/match/:matchId/detail 경로로 GET 요청한다', async () => {
    const mockRes = {
      json: vi.fn().mockResolvedValue({}),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await getPastMatchDetail({ matchId: 42 });

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/match/42/detail');
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = {
      success: true,
      data: { lineups: [], events: [] },
      error: null,
    };
    const mockRes = {
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await getPastMatchDetail({ matchId: 42 });

    expect(result).toEqual(data);
  });
});
