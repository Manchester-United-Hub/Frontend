import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { fetchPremierLeagueRankList } from '@entities/rank/api/client/premierLeagueRank';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

describe('fetchPremierLeagueRankList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/rank/pl 경로로 GET 요청한다', async () => {
    const mockRes = {
      json: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await fetchPremierLeagueRankList();

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/rank/pl');
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = {
      success: true,
      data: [{ id: '33', name: 'Manchester United' }],
      error: null,
    };
    const mockRes = {
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await fetchPremierLeagueRankList();

    expect(result).toEqual(data);
  });
});
