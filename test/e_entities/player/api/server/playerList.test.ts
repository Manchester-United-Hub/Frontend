import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher } from '@shared/api';
import { fetchPlayerList } from '@entities/player/api/server/playerList';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

const validQuery = { season: 2024, position: 'FW' };

describe('fetchPlayerList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/players 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    const mockRes = { ok: true, status: 200, json: vi.fn().mockResolvedValue({}) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await fetchPlayerList(validQuery);

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/players', validQuery);
  });

  it('position 없이도 요청할 수 있다', async () => {
    const mockRes = { ok: true, status: 200, json: vi.fn().mockResolvedValue({}) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await fetchPlayerList({ season: 2024 });

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/players', { season: 2024 });
  });

  it('응답을 ServerApiResult 형태로 반환한다', async () => {
    const data = { players: [] };
    const mockRes = { ok: true, status: 200, json: vi.fn().mockResolvedValue(data) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchPlayerList(validQuery);

    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(data);
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'SERVER_ERROR', message: '서버 오류' };
    const mockRes = { ok: false, status: 500, json: vi.fn().mockResolvedValue(errorData) };
    vi.mocked(serverFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchPlayerList(validQuery);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(500);
    expect(result.data).toEqual(errorData);
  });
});
