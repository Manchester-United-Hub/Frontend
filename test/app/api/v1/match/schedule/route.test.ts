import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSeason } from '@app/api/v1/match/schedule/route';
import { fetchMatchScheduleList } from '@entities/matches/api/server';

vi.mock('@entities/matches/api/server', () => ({
  fetchMatchScheduleList: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/match/schedule', () => {
  beforeEach(() => vi.clearAllMocks());

  it('season 값은 7월을 기준으로 이전 연도와 해당 연도로 바뀐다.', () => {
    const now = new Date('2026-06-30T00:00:00');
    const tomorrow = new Date('2026-07-01T00:00:00');

    expect(getSeason(now)).toBe('2025');
    expect(getSeason(tomorrow)).toBe('2026');
  });

  it('fetchMatchScheduleList를 호출한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { pastMatches: [], upcomingMatches: [] },
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    await GET();

    expect(fetchMatchScheduleList).toHaveBeenCalledOnce();
  });

  it('fetchMatchScheduleList 결과의 status로 응답한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { pastMatches: [], upcomingMatches: [] },
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
