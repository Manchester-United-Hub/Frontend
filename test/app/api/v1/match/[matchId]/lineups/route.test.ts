import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchLiveMatchLineup } from '@entities/matches/api/server';

vi.mock('@entities/matches/api/server', () => ({
  fetchLiveMatchLineup: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/match/[matchId]/lineups', () => {
  beforeEach(() => vi.clearAllMocks());

  it('matchId를 number로 변환해 fetchLiveMatchLineup을 호출한다', async () => {
    vi.mocked(fetchLiveMatchLineup).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { matchId: 100, lineups: [] },
    });

    const { GET } = await import('@app/api/v1/match/[matchId]/lineups/route');
    const request = new NextRequest(
      'http://localhost/api/v1/match/100/lineups'
    );
    await GET(request, { params: Promise.resolve({ matchId: '100' }) });

    expect(fetchLiveMatchLineup).toHaveBeenCalledWith({
      matchId: 100,
    });
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchLiveMatchLineup).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { matchId: 100, lineups: [] },
    });

    const { GET } = await import('@app/api/v1/match/[matchId]/lineups/route');
    const request = new NextRequest(
      'http://localhost/api/v1/match/100/lineups'
    );
    const response = await GET(request, {
      params: Promise.resolve({ matchId: '100' }),
    });

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchLiveMatchLineup).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { GET } = await import('@app/api/v1/match/[matchId]/lineups/route');
    const request = new NextRequest(
      'http://localhost/api/v1/match/100/lineups'
    );
    const response = await GET(request, {
      params: Promise.resolve({ matchId: '100' }),
    });

    expect(response.status).toBe(500);
  });
});
