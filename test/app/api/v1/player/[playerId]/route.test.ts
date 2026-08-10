import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchPlayerProfile } from '@entities/player/api/server';

vi.mock('@entities/player/api/server', () => ({
  fetchPlayerProfile: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/player/[playerId]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('playerId를 number로, season을 파싱해 fetchPlayerProfile을 호출한다', async () => {
    vi.mocked(fetchPlayerProfile).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { id: 1485 } as never,
    });

    const { GET } = await import('@app/api/v1/player/[playerId]/route');
    const request = new NextRequest('http://localhost/api/v1/player/1485?season=2025');
    await GET(request, { params: Promise.resolve({ playerId: '1485' }) });

    expect(fetchPlayerProfile).toHaveBeenCalledWith(1485, { season: 2025 });
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchPlayerProfile).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { id: 1485 } as never,
    });

    const { GET } = await import('@app/api/v1/player/[playerId]/route');
    const request = new NextRequest('http://localhost/api/v1/player/1485?season=2025');
    const response = await GET(request, { params: Promise.resolve({ playerId: '1485' }) });

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchPlayerProfile).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { GET } = await import('@app/api/v1/player/[playerId]/route');
    const request = new NextRequest('http://localhost/api/v1/player/1485?season=2025');
    const response = await GET(request, { params: Promise.resolve({ playerId: '1485' }) });

    expect(response.status).toBe(500);
  });
});
