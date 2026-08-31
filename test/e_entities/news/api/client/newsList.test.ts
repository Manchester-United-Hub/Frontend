import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clientFetcher } from '@shared/api';
import { getNewsList } from '@entities/news/api/client/newsList';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

describe('getNewsList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/api/v1/news 경로로 query와 함께 GET 요청한다', async () => {
    const mockRes = { json: vi.fn().mockResolvedValue({}) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const query = { cursorAt: '2026-01-01T00:00', cursorId: 10, size: 10 };
    await getNewsList(query);

    expect(clientFetcher.get).toHaveBeenCalledWith('/api/v1/news', query);
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = {
      success: true,
      data: { newsList: [], nextCursorAt: '2026-01-01T00:00', nextCursorId: 0 },
      error: null,
    };
    const mockRes = { json: vi.fn().mockResolvedValue(data) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await getNewsList({ cursorAt: '2026-01-01T00:00', cursorId: 10, size: 10 });

    expect(result).toEqual(data);
  });
});
