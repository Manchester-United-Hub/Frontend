import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher } from '@shared/api';
import { fetchPlayerList } from '@entities/player/api/server/playerList';
import { BASE_PLAYER_DTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

const validQuery = { season: 2024, size: 100 };
const listDTO = buildPlayerListDTO([BASE_PLAYER_DTO]);

const mockResponse = (ok: boolean, status: number, data: unknown) => {
  vi.mocked(serverFetcher.get).mockResolvedValue({
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response);
};

describe('fetchPlayerList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/players 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    mockResponse(true, 200, listDTO);

    await fetchPlayerList(validQuery);

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/players', validQuery);
  });

  it('페이지 봉투 응답을 ServerApiResult 형태로 반환한다', async () => {
    mockResponse(true, 200, listDTO);

    const result = await fetchPlayerList(validQuery);

    expect(result.isSuccess).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual(listDTO);
  });

  it('계약과 다른 응답(배열)은 502 UPSTREAM_CONTRACT_MISMATCH로 반환한다', async () => {
    mockResponse(true, 200, [BASE_PLAYER_DTO]);

    const result = await fetchPlayerList(validQuery);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(502);
  });

  it('요청 실패 시 isSuccess가 false이고 에러 데이터를 반환한다', async () => {
    const errorData = { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' };
    mockResponse(false, 500, errorData);

    const result = await fetchPlayerList(validQuery);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(500);
    expect(result.data).toEqual(errorData);
  });
});
