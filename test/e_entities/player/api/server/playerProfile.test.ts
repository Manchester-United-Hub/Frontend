import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher } from '@shared/api';
import { fetchPlayerProfile } from '@entities/player/api/server/playerProfile';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

const playerId = 1485;
const validQuery = { season: 2025 };

describe('fetchPlayerProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/players/{playerId} 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    const mockRes = { ok: true, status: 200, json: vi.fn().mockResolvedValue({}) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await fetchPlayerProfile(playerId, validQuery);

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/players/1485', validQuery);
  });

  it('응답을 ServerApiResult 형태로 반환한다', async () => {
    const data = { id: playerId, name: 'Bruno Fernandes' };
    const mockRes = { ok: true, status: 200, json: vi.fn().mockResolvedValue(data) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchPlayerProfile(playerId, validQuery);

    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(data);
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'SERVER_ERROR', message: '서버 오류' };
    const mockRes = { ok: false, status: 500, json: vi.fn().mockResolvedValue(errorData) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchPlayerProfile(playerId, validQuery);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(500);
    expect(result.data).toEqual(errorData);
  });
});
