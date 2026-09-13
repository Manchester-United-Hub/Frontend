/**
 * GET /api/v1/match/landing 라우트 테스트. schedule/route.test.ts와 동일한 형태 —
 * route handler는 얇은 HTTP 어댑터이므로 getLandingMatches만 mock하고 status 배선을
 * 검증한다. 쿼리 파라미터가 없으므로 NextRequest 대신 GET()을 인자 없이 호출한다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getLandingMatches } from '@entities/matches/api/server/getLandingMatches';

vi.mock('@entities/matches/api/server/getLandingMatches', () => ({
  getLandingMatches: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/match/landing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getLandingMatches가 값을 반환하면 200으로 응답하고 recent·next를 그대로 담는다', async () => {
    const landingMatches = { recent: null, next: null };
    vi.mocked(getLandingMatches).mockResolvedValue(landingMatches);

    const { GET } = await import('@app/api/v1/match/landing/route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual(landingMatches);
  });

  it('recent·next가 둘 다 null이어도(개막 전·시즌 종료) 200으로 응답한다', async () => {
    vi.mocked(getLandingMatches).mockResolvedValue({
      recent: null,
      next: null,
    });

    const { GET } = await import('@app/api/v1/match/landing/route');
    const response = await GET();

    expect(response.status).toBe(200);
  });

  it('getLandingMatches가 null을 반환하면(상류 실패) 502 SCHEDULE_UNAVAILABLE로 응답한다', async () => {
    vi.mocked(getLandingMatches).mockResolvedValue(null);

    const { GET } = await import('@app/api/v1/match/landing/route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.data.code).toBe('SCHEDULE_UNAVAILABLE');
  });
});
