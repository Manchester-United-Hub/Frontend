import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

import { getHighlightList } from '@entities/highlight/api/client';
import { highlightQueries } from '@features/highlight/api/highlightQueries';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/highlight/api/client', () => ({
  getHighlightList: vi.fn(),
}));

const PARAMS = { season: 2026, sort: 'VIEW_COUNT', page: 2 } as const;
const EXPECTED_QUERY = { ...PARAMS, size: 9 };

describe('highlightQueries.list', () => {
  beforeEach(() => vi.mocked(getHighlightList).mockReset());

  it('queryKey는 시즌·정렬·페이지와 페이지 크기 9를 담는다', () => {
    expect(highlightQueries.list(PARAMS).queryKey).toEqual(['highlight', 'list', EXPECTED_QUERY]);
  });

  it('정렬이나 페이지가 다르면 queryKey도 다르다', () => {
    const latest = highlightQueries.list({ ...PARAMS, sort: 'LATEST' }).queryKey;
    const nextPage = highlightQueries.list({ ...PARAMS, page: 3 }).queryKey;

    expect(latest).not.toEqual(highlightQueries.list(PARAMS).queryKey);
    expect(nextPage).not.toEqual(highlightQueries.list(PARAMS).queryKey);
  });

  it('staleTime은 300_000이다', () => {
    expect(highlightQueries.list(PARAMS).staleTime).toBe(300_000);
  });

  it('success:true 응답이면 BFF 봉투를 언랩해 HighlightListDTO를 반환한다', async () => {
    const dto = buildHighlightListDTO([buildHighlightDTO()]);
    vi.mocked(getHighlightList).mockResolvedValue({ success: true, data: dto, error: null });

    const result = await new QueryClient().fetchQuery(highlightQueries.list(PARAMS));

    expect(result).toEqual(dto);
    expect(getHighlightList).toHaveBeenCalledWith(EXPECTED_QUERY);
  });

  it('success:false 응답이면 throw해 fetchQuery가 reject된다', async () => {
    vi.mocked(getHighlightList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    await expect(new QueryClient().fetchQuery(highlightQueries.list(PARAMS))).rejects.toThrow(
      '서버 오류'
    );
  });
});
