import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { fetchNewsList, fetchRecentNews } from '@entities/news/api/server';

vi.mock('@entities/news/api/server', () => ({
  fetchNewsList: vi.fn(),
  fetchRecentNews: vi.fn(),
}));

vi.mock('@shared/model', () => ({
  toBffResponse: vi.fn((result) => result),
}));

describe('GET /api/v1/news', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('preview=1 일 때', () => {
    it('fetchRecentNews를 호출한다', async () => {
      vi.mocked(fetchRecentNews).mockResolvedValue({ isSuccess: true, status: 200, data: [] });

      const { GET } = await import('@app/api/v1/news/route');
      const request = new NextRequest('http://localhost/api/v1/news?preview=1');
      await GET(request);

      expect(fetchRecentNews).toHaveBeenCalledOnce();
      expect(fetchNewsList).not.toHaveBeenCalled();
    });
  });

  describe('일반 목록 조회일 때', () => {
    it('fetchNewsList를 query 파라미터와 함께 호출한다', async () => {
      vi.mocked(fetchNewsList).mockResolvedValue({ isSuccess: true, status: 200, data: {} });

      const { GET } = await import('@app/api/v1/news/route');
      const request = new NextRequest(
        'http://localhost/api/v1/news?cursorAt=2024-01-15T20:00&cursorId=1&size=10'
      );
      await GET(request);

      expect(fetchNewsList).toHaveBeenCalledOnce();
      expect(fetchRecentNews).not.toHaveBeenCalled();
    });

    it('200 응답을 반환한다', async () => {
      vi.mocked(fetchNewsList).mockResolvedValue({ isSuccess: true, status: 200, data: {} });

      const { GET } = await import('@app/api/v1/news/route');
      const request = new NextRequest(
        'http://localhost/api/v1/news?cursorAt=2024-01-15T20:00&cursorId=1&size=10'
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
    });
  });
});
