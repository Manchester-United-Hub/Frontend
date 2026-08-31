/**
 * plan.json architecture.decisions[A-5] — 이 라우트는 더 이상 getSeason(7월 기준
 * 시즌 경계 파생)을 export하지 않는다. season의 단일 출처가 업스트림
 * /api/seasons/current → getSeasonInfo로 옮겨졌기 때문이다(getSeasonInfo.ts 주석
 * A-8). 그래서 'season 값은 7월을 기준으로...' 케이스는 피검 대상 자체가 src에서
 * 사라져 삭제한다(S-1 예외 — 커버리지 인계처 명시).
 *
 * 커버리지 인계처("7월 기준 시즌 경계" 파생 로직):
 * - test/e_entities/seasonInfo/utils/formatSeasonLabel.test.ts
 * - test/e_entities/seasonInfo/utils/resolveSeasonStatus.test.ts
 * - test/e_entities/seasonInfo/api/server/getSeasonInfo.test.ts
 *
 * 대신 이 라우트는 이제 GET(req: NextRequest)로 ?season=YYYY 쿼리를 받아 검증한다
 * (4자리 정규식, >= 1992, 위반 시 422 INVALID_SEASON). 그 검증 경로는 이전까지
 * 완전 무테스트였으므로 이 파일에서 신규로 커버한다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
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
      data: { pastMatches: [], upcomingMatches: [] },
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    const request = new NextRequest(
      'http://localhost/api/v1/match/schedule?season=2025'
    );
    await GET(request);

    expect(fetchMatchScheduleList).toHaveBeenCalledWith({ season: '2025' });
  });

  it('fetchMatchScheduleList 결과의 status로 응답한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: true,
      status: 200,
      data: { pastMatches: [], upcomingMatches: [] },
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    const request = new NextRequest(
      'http://localhost/api/v1/match/schedule?season=2025'
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it('외부 API 실패 시 500 상태로 응답한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { GET } = await import('@app/api/v1/match/schedule/route');
    const request = new NextRequest(
      'http://localhost/api/v1/match/schedule?season=2025'
    );
    const response = await GET(request);

    expect(response.status).toBe(500);
  });

  describe('season 쿼리가 유효하지 않을 때', () => {
    it('season 누락 시 422를 반환하고 fetchMatchScheduleList를 호출하지 않는다', async () => {
      const { GET } = await import('@app/api/v1/match/schedule/route');
      const request = new NextRequest(
        'http://localhost/api/v1/match/schedule'
      );
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.data.code).toBe('INVALID_SEASON');
      expect(fetchMatchScheduleList).not.toHaveBeenCalled();
    });

    // 19999는 5자리 숫자다: 정규식(/^\d{4}$/)만 이를 거른다 — Number(19999) >= 1992는
    // 참이므로, 정규식 체크가 없다면 min-year 체크를 그대로 통과해버려 이 케이스가
    // 정규식 분기를 전혀 검증하지 못한다(mutation으로 실측 확인, result-ST-08-rework-1.md).
    it('season이 4자리가 아니면 422를 반환하고 fetchMatchScheduleList를 호출하지 않는다', async () => {
      const { GET } = await import('@app/api/v1/match/schedule/route');
      const request = new NextRequest(
        'http://localhost/api/v1/match/schedule?season=19999'
      );
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.data.code).toBe('INVALID_SEASON');
      expect(fetchMatchScheduleList).not.toHaveBeenCalled();
    });

    // 0x7e9는 숫자 이외 문자(x, e)를 포함하지만 Number('0x7e9')는 16진수로 해석돼
    // 2025(>= 1992)가 된다. 정규식만 이 형식을 거른다 — 'abcd' 같은 완전 비숫자
    // 문자열은 정규식이 없어도 Number()가 NaN을 반환해 min-year 체크에 걸리므로
    // 정규식 분기를 검증하지 못한다(mutation으로 실측 확인).
    it('season에 숫자 이외 문자가 포함되면 422를 반환하고 fetchMatchScheduleList를 호출하지 않는다', async () => {
      const { GET } = await import('@app/api/v1/match/schedule/route');
      const request = new NextRequest(
        'http://localhost/api/v1/match/schedule?season=0x7e9'
      );
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.data.code).toBe('INVALID_SEASON');
      expect(fetchMatchScheduleList).not.toHaveBeenCalled();
    });

    it('season이 1992 미만이면 422를 반환하고 fetchMatchScheduleList를 호출하지 않는다', async () => {
      const { GET } = await import('@app/api/v1/match/schedule/route');
      const request = new NextRequest(
        'http://localhost/api/v1/match/schedule?season=1991'
      );
      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(422);
      expect(body.data.code).toBe('INVALID_SEASON');
      expect(fetchMatchScheduleList).not.toHaveBeenCalled();
    });
  });
});
