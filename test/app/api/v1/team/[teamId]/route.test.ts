import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchTeamInfo } from '@entities/team/api/server';

vi.mock('@entities/team/api/server', () => ({
  fetchTeamInfo: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/team/[teamId]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('teamId를 number로 변환해 fetchTeamInfo를 호출한다', async () => {
    vi.mocked(fetchTeamInfo).mockResolvedValue({ isSuccess: true, status: 200, data: {} });

    const { GET } = await import('@app/api/v1/team/[teamId]/route');
    const request = new NextRequest('http://localhost/api/v1/team/33');
    await GET(request, { params: Promise.resolve({ teamId: '33' }) });

    expect(fetchTeamInfo).toHaveBeenCalledWith({ teamId: 33 });
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchTeamInfo).mockResolvedValue({ isSuccess: true, status: 200, data: {} });

    const { GET } = await import('@app/api/v1/team/[teamId]/route');
    const request = new NextRequest('http://localhost/api/v1/team/33');
    const response = await GET(request, { params: Promise.resolve({ teamId: '33' }) });

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchTeamInfo).mockResolvedValue({ isSuccess: false, status: 500, data: null });

    const { GET } = await import('@app/api/v1/team/[teamId]/route');
    const request = new NextRequest('http://localhost/api/v1/team/33');
    const response = await GET(request, { params: Promise.resolve({ teamId: '33' }) });

    expect(response.status).toBe(500);
  });
});
