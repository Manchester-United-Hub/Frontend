import { describe, it, expect, vi, beforeEach } from 'vitest';
import { serverFetcher } from '@shared/api';
import { fetchCoach } from '@entities/coach/api/server/coach';
import { COACH_DTO_FIXTURE } from '@test/fixtures/coach';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, serverFetcher: { get: vi.fn() } };
});

const teamId = 33;

const mockResponse = (ok: boolean, status: number, body: unknown) => {
  const response = { ok, status, json: vi.fn().mockResolvedValue(body) };
  vi.mocked(serverFetcher.get).mockResolvedValue(response as unknown as Response);
};

describe('fetchCoach', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/coaches/{teamId} 경로로 GET 요청한다', async () => {
    mockResponse(true, 200, COACH_DTO_FIXTURE);

    await fetchCoach(teamId);

    expect(serverFetcher.get).toHaveBeenCalledWith('/api/coaches/33');
  });

  it('계약에 맞는 응답은 isSuccess true로 반환한다', async () => {
    mockResponse(true, 200, COACH_DTO_FIXTURE);

    const result = await fetchCoach(teamId);

    expect(result).toEqual({ isSuccess: true, status: 200, data: COACH_DTO_FIXTURE });
  });

  it('실측처럼 nullable 필드가 null이어도 계약 위반으로 보지 않는다', async () => {
    const nullableCoach = {
      ...COACH_DTO_FIXTURE,
      photo: null,
      birthDate: null,
      birthPlace: null,
      appointmentDate: null,
      contractEndDate: null,
      nationality: null,
      careers: [],
    };
    mockResponse(true, 200, nullableCoach);

    const result = await fetchCoach(teamId);

    expect(result.isSuccess).toBe(true);
    expect(result.data).toEqual(nullableCoach);
  });

  it('HTTP 실패 시 isSuccess false와 에러 응답을 그대로 반환한다', async () => {
    const errorData = { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' };
    mockResponse(false, 500, errorData);

    const result = await fetchCoach(teamId);

    expect(result).toEqual({ isSuccess: false, status: 500, data: errorData });
  });

  it('응답이 스키마와 다르면 502 UPSTREAM_CONTRACT_MISMATCH로 반환한다', async () => {
    mockResponse(true, 200, { ...COACH_DTO_FIXTURE, name: null });

    const result = await fetchCoach(teamId);

    expect(result.isSuccess).toBe(false);
    expect(result.status).toBe(502);
    expect(result.data).toMatchObject({ code: 'UPSTREAM_CONTRACT_MISMATCH' });
  });
});
