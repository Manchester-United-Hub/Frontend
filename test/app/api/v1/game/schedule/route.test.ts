import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGameScheduleList } from '@entities/game/api/server';

vi.mock('@entities/game/api/server', () => ({
  fetchGameScheduleList: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/game/schedule', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetchGameScheduleList를 호출한다', async () => {
    vi.mocked(fetchGameScheduleList).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

    const { GET } = await import('@app/api/v1/game/schedule/route');
    await GET();

    expect(fetchGameScheduleList).toHaveBeenCalledOnce();
  });

  it('fetchGameScheduleList 결과의 status로 응답한다', async () => {
    vi.mocked(fetchGameScheduleList).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

    const { GET } = await import('@app/api/v1/game/schedule/route');
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchGameScheduleList).mockResolvedValue({ isSuccess: false, status: 500, data: null });

    const { GET } = await import('@app/api/v1/game/schedule/route');
    const response = await GET();

    expect(response.status).toBe(500);
  });
});
