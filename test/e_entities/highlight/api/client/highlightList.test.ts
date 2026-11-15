import { describe, it, expect, vi, beforeEach } from 'vitest';

import { clientFetcher } from '@shared/api';
import { getHighlightList } from '@entities/highlight/api/client/highlightList';

vi.mock('@shared/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@shared/api')>();
  return { ...actual, clientFetcher: { get: vi.fn() } };
});

const query = { season: 2026, size: 100 };

describe('getHighlightList', () => {
  beforeEach(() => vi.clearAllMocks());

  it('/bff/v1/highlight 경로로 query 파라미터와 함께 GET 요청한다', async () => {
    const mockRes = { json: vi.fn().mockResolvedValue({}) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    await getHighlightList(query);

    expect(clientFetcher.get).toHaveBeenCalledWith('/bff/v1/highlight', query);
  });

  it('json()의 반환값을 그대로 반환한다', async () => {
    const data = { success: true, data: { season: 2026 }, error: null };
    const mockRes = { json: vi.fn().mockResolvedValue(data) };
    vi.mocked(clientFetcher.get).mockResolvedValue(mockRes as unknown as Response);

    const result = await getHighlightList(query);

    expect(result).toEqual(data);
  });
});
