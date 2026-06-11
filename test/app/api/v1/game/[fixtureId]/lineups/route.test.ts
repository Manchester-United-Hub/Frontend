import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchLiveGameLineup } from '@entities/game/api/server';

vi.mock('@entities/game/api/server', () => ({
  fetchLiveGameLineup: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/game/[fixtureId]/lineups', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fixtureId를 number로 변환해 fetchLiveGameLineup을 호출한다', async () => {
    vi.mocked(fetchLiveGameLineup).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { fixtureId: 100, lineups: [] },
    });

    const { GET } = await import('@app/api/v1/game/[fixtureId]/lineups/route');
    const request = new NextRequest('http://localhost/api/v1/game/100/lineups');
    await GET(request, { params: Promise.resolve({ fixtureId: '100' }) });

    expect(fetchLiveGameLineup).toHaveBeenCalledWith({
      fixtureId: 100,
    });
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchLiveGameLineup).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { fixtureId: 100, lineups: [] },
    });

    const { GET } = await import('@app/api/v1/game/[fixtureId]/lineups/route');
    const request = new NextRequest('http://localhost/api/v1/game/100/lineups');
    const response = await GET(request, {
      params: Promise.resolve({ fixtureId: '100' }),
    });

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchLiveGameLineup).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { GET } = await import('@app/api/v1/game/[fixtureId]/lineups/route');
    const request = new NextRequest('http://localhost/api/v1/game/100/lineups');
    const response = await GET(request, {
      params: Promise.resolve({ fixtureId: '100' }),
    });

    expect(response.status).toBe(500);
  });
});
