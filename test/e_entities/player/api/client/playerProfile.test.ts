import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { getPlayerProfile } from '@entities/player/api/client/playerProfile';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

const playerId = 1485;
const query = { season: 2025 };

describe('getPlayerProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/player/{playerId} 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    const mockRes = { json: vi.fn().mockResolvedValue({}) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await getPlayerProfile(playerId, query);

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/player/1485', query);
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = { success: true, data: { id: playerId }, error: null };
    const mockRes = { json: vi.fn().mockResolvedValue(data) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await getPlayerProfile(playerId, query);

    expect(result).toEqual(data);
  });
});
