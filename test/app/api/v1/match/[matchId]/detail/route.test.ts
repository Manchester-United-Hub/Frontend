import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchPastMatchDetail } from '@entities/matches/api/server';

vi.mock('@entities/matches/api/server', () => ({
  fetchPastMatchDetail: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/match/[matchId]/detail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('matchId를 number로 변환해 fetchPastMatchDetail을 호출한다', async () => {
    vi.mocked(fetchPastMatchDetail).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { lineups: [], events: [] },
    });

    const { GET } = await import('@app/api/v1/match/[matchId]/detail/route');
    const request = new NextRequest('http://localhost/api/v1/match/100/detail');
    await GET(request, { params: Promise.resolve({ matchId: '100' }) });

    expect(fetchPastMatchDetail).toHaveBeenCalledWith({
      matchId: 100,
    });
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchPastMatchDetail).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { lineups: [], events: [] },
    });

    const { GET } = await import('@app/api/v1/match/[matchId]/detail/route');
    const request = new NextRequest('http://localhost/api/v1/match/100/detail');
    const response = await GET(request, {
      params: Promise.resolve({ matchId: '100' }),
    });

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchPastMatchDetail).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { GET } = await import('@app/api/v1/match/[matchId]/detail/route');
    const request = new NextRequest('http://localhost/api/v1/match/100/detail');
    const response = await GET(request, {
      params: Promise.resolve({ matchId: '100' }),
    });

    expect(response.status).toBe(500);
  });
});
