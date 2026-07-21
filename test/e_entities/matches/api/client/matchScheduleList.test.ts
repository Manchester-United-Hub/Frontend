import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { getMatchScheduleList } from '@entities/matches/api/client/matchScheduleList';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

describe('getMatchScheduleList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/match/schedule 경로로 GET 요청한다', async () => {
    const mockRes = {
      json: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    await getMatchScheduleList();

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/match/schedule');
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = {
      success: true,
      data: [{ matchId: 1 }],
      error: null,
    };
    const mockRes = {
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(clientFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await getMatchScheduleList();

    expect(result).toEqual(data);
  });
});
