import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher, API_PATH } from '@shared/api';
import { fetchGameScheduleList } from '@entities/game/api/server/gameScheduleList';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

describe('fetchGameScheduleList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('응답을 ServerApiResult 형태로 반환한다', async () => {
    const data = [{ fixtureId: 1 }];
    const mockRes = {
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(data),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await fetchGameScheduleList();

    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(data);
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'SERVER_ERROR', message: '서버 오류' };
    const mockRes = {
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue(errorData),
    };
    vi.mocked(serverFetcher.get).mockResolvedValue(
      mockRes as unknown as Response
    );

    const result = await fetchGameScheduleList();

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(500);
    expect(result.data).toEqual(errorData);
  });
});
