import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getCurrentSeason } from '@entities/season/api/server';

vi.mock('@entities/season/api/server', () => ({
  getCurrentSeason: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

const requestGET = async () => {
  const { GET } = await import('@app/api/v1/season/route');
  return GET();
};

describe('GET /api/v1/season', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('성공 응답일 때', () => {
    it('조회한 시즌 데이터를 그대로 담아 응답한다', async () => {
      vi.mocked(getCurrentSeason).mockResolvedValue({
        isSuccess: true,
        status: 200,
        data: { season: 2026, started: true },
      });

      const response = await requestGET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.data).toEqual({ season: 2026, started: true });
    });
  });

  describe('실패 응답일 때', () => {
    it('원본 에러 데이터와 실패 status를 그대로 응답한다', async () => {
      const errorData = { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' };
      vi.mocked(getCurrentSeason).mockResolvedValue({
        isSuccess: false,
        status: 500,
        data: errorData,
      });

      const response = await requestGET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.data).toEqual(errorData);
    });

    it('업스트림이 502를 반환하면 502를 그대로 전달한다', async () => {
      const errorData = {
        code: 'UPSTREAM_CONTRACT_MISMATCH',
        message: '스키마 불일치',
      };
      vi.mocked(getCurrentSeason).mockResolvedValue({
        isSuccess: false,
        status: 502,
        data: errorData,
      });

      const response = await requestGET();
      const body = await response.json();

      expect(response.status).toBe(502);
      expect(body.data).toEqual(errorData);
    });
  });

  describe('예외가 발생했을 때', () => {
    it('500과 SERVER_ERROR 메시지를 반환한다', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(getCurrentSeason).mockRejectedValue(new Error('network error'));

      const response = await requestGET();
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.data).toEqual({
        code: '500',
        message: 'SERVER_ERROR: check your server log.',
      });
    });
  });
});
