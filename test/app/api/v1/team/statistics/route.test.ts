import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTeamStatistics } from '@entities/team/api/server';

vi.mock('@entities/team/api/server', () => ({
  fetchTeamStatistics: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/team/statistics', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchTeamStatistics를 호출한다', async () => {
    vi.mocked(fetchTeamStatistics).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

    const { GET } = await import('@app/api/v1/team/statistics/route');
    await GET();

    expect(fetchTeamStatistics).toHaveBeenCalledOnce();
  });

  it('200 응답을 반환한다', async () => {
    vi.mocked(fetchTeamStatistics).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

    const { GET } = await import('@app/api/v1/team/statistics/route');
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchTeamStatistics).mockResolvedValue({ isSuccess: false, status: 500, data: null });

    const { GET } = await import('@app/api/v1/team/statistics/route');
    const response = await GET();

    expect(response.status).toBe(500);
  });
});
