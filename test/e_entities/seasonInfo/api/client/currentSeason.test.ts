import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { fetchCurrentSeason } from '@entities/seasonInfo/api/client/currentSeason';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

describe('fetchCurrentSeason', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/season 경로로 GET 요청한다', async () => {
    const mockRes = { json: vi.fn().mockResolvedValue({}) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await fetchCurrentSeason();

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/season');
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = { success: true, data: { season: 2026, started: true }, error: null };
    const mockRes = { json: vi.fn().mockResolvedValue(data) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await fetchCurrentSeason();

    expect(result).toEqual(data);
  });
});
