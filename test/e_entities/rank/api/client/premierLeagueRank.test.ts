/**
 * fetchPremierLeagueRankList 단위 테스트.
 *
 * 검증 목적:
 * - season 없이 호출하면 clientFetcher.get이 (path, undefined) 2-인자로 불린다 (레거시 하위호환)
 * - season을 넘기면 실제 BFF 요청 쿼리에 season이 실린다 (D-4)
 * - json()의 반환값을 그대로 반환한다
 */

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

    expect(clientFetcher.get).toHaveBeenCalledWith(
      '/api/v1/rank/pl',
      undefined
    );
  });

  it('season을 넘기면 BFF 요청 쿼리에 season이 실린다 (D-4)', async () => {
    const mockRes = {
      json: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await fetchPremierLeagueRankList({ season: 2026 });

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/rank/pl', {
      season: 2026,
    });
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
