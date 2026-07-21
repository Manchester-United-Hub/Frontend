import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMatchScheduleList } from '@entities/matches/api/server';

vi.mock('@entities/matches/api/server', () => ({
  fetchMatchScheduleList: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/match/schedule', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchMatchScheduleList를 호출한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: [],
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    await GET();

    expect(fetchMatchScheduleList).toHaveBeenCalledOnce();
  });

  it('fetchMatchScheduleList 결과의 status로 응답한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: [],
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    const response = await GET();

    expect(response.status).toBe(500);
  });
});
