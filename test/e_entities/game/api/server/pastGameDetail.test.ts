import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher } from '@shared/api';
import { fetchPastGameDetail } from '@entities/game/api/server/pastGameDetail';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

describe('fetchPastGameDetail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/fixtures/:fixtureId/detail 경로로 GET 요청한다', async () => {
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({}),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await fetchPastGameDetail({ fixtureId: 42 });

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/fixtures/42/detail');
  });

  it('응답을 ServerApiResult 형태로 반환한다', async () => {
    const data = { lineups: [], events: [] };
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await fetchPastGameDetail({ fixtureId: 42 });

    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(data);
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'NOT_FOUND', message: '찾을 수 없음' };
    const mockRes = {
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue(errorData),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await fetchPastGameDetail({ fixtureId: 99 });

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(404);
    expect(result.data).toEqual(errorData);
  });
});
