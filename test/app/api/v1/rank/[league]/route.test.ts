import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getPremierLeagueRank } from '@entities/rank/api/server';
import type { PLRankDTO } from '@entities/rank/model';

vi.mock('@entities/rank/api/server', () => ({
  getPremierLeagueRank: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

const createPlRankDTO = (overrides: Partial<PLRankDTO> = {}): PLRankDTO => ({
  season: '2025-26',
  ranks: [
    {
      rank: 1,
      teamId: 33,
      teamName: 'Manchester United',
      teamLogo: 'https://example.com/mun.png',
      points: 70,
      played: 30,
      win: 22,
      draw: 4,
      lose: 4,
      goalsFor: 60,
      goalsAgainst: 25,
      goalsDiff: 35,
      form: 'WWDLW',
    },
  ],
  ...overrides,
});

const requestGET = async (league: string) => {
  const { GET } = await import('@app/api/v1/rank/[league]/route');
  const request = new NextRequest('http://localhost/api/v1/rank/pl');
  return GET(request, { params: Promise.resolve({ league }) });
};

describe('GET /api/v1/rank/[league]', () => {
  beforeEach(() => vi.clearAllMocks());

  describe("league가 'pl'이고 성공 응답일 때", () => {
    it('convertPLRankDTO2DAO로 변환된 Standing[] 모양의 data를 담아 응답한다', async () => {
      vi.mocked(getPremierLeagueRank).mockResolvedValue({
        isSuccess: true,
        status: 200,
        data: createPlRankDTO(),
      });

      const response = await requestGET('pl');
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.data[0]).toMatchObject({
        pos: 1,
        code: expect.any(String),
        nm: expect.any(String),
        teamLogoUrl: 'https://example.com/mun.png',
        p: 30,
        w: 22,
        d: 4,
        l: 4,
        gf: 60,
        ga: 25,
        pts: 70,
        diff: 35,
        form: ['W', 'W', 'D', 'L', 'W'],
        mv: 'same',
        utd: true,
        zone: 'ucl',
      });
    });

    it('getPremierLeagueRank를 인자 없이 호출한다', async () => {
      vi.mocked(getPremierLeagueRank).mockResolvedValue({
        isSuccess: true,
        status: 200,
        data: createPlRankDTO(),
      });

      await requestGET('pl');

      expect(getPremierLeagueRank).toHaveBeenCalledWith();
    });
  });

  describe("league가 'pl'이고 실패 응답일 때", () => {
    it('변환 없이 원본 에러 데이터와 실패 status를 그대로 응답한다', async () => {
      const errorData = { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' };
      vi.mocked(getPremierLeagueRank).mockResolvedValue({
        isSuccess: false,
        status: 500,
        data: errorData,
      });

      const response = await requestGET('pl');
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.data).toEqual(errorData);
    });
  });

  describe("league가 'pl'이 아닐 때", () => {
    it('getPremierLeagueRank를 호출하지 않고 400을 반환한다', async () => {
      const response = await requestGET('invalid');
      const body = await response.json();

      expect(getPremierLeagueRank).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      expect(body.data).toEqual({
        code: '400',
        message: 'URL_ERROR: check your URL Params. league: invalid',
      });
    });
  });

  describe('예외가 발생했을 때', () => {
    it('500과 SERVER_ERROR 메시지를 반환한다', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(getPremierLeagueRank).mockRejectedValue(new Error('network error'));

      const response = await requestGET('pl');
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.data).toEqual({
        code: '500',
        message: 'SERVER_ERROR: check your server log.',
      });
    });
  });
});
