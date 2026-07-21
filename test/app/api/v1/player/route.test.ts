import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchPlayerList } from '@entities/player/api/server';

vi.mock('@entities/player/api/server', () => ({
  fetchPlayerList: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/player', () => {
  beforeEach(() => vi.clearAllMocks());

  it('season을 파싱해 fetchPlayerList를 호출한다', async () => {
    vi.mocked(fetchPlayerList).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

    const { GET } = await import('@app/api/v1/player/route');
    const request = new NextRequest('http://localhost/api/v1/player?season=2024');
    await GET(request);

    expect(fetchPlayerList).toHaveBeenCalledWith({ season: 2024 });
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchPlayerList).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

    const { GET } = await import('@app/api/v1/player/route');
    const request = new NextRequest('http://localhost/api/v1/player?season=2024');
    const response = await GET(request);

    expect(response.status).toBe(200);
  });
});
