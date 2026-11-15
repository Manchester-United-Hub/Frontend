import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

import { fetchHighlightList } from '@entities/highlight/api/server';
import { highlightQueries } from '@features/highlight/api/highlightQueries';
import { highlightServerQueries } from '@features/highlight/api/highlightServerQueries';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/highlight/api/server', () => ({
  fetchHighlightList: vi.fn(),
}));
vi.mock('@entities/highlight/api/client', () => ({
  getHighlightList: vi.fn(),
}));

const PARAMS = { season: 2026, sort: 'LATEST', page: 0 } as const;

describe('highlightServerQueries.list', () => {
  beforeEach(() => vi.mocked(fetchHighlightList).mockReset());

  it('클라이언트 쿼리와 같은 queryKey·staleTime을 써서 hydrate된 데이터를 재사용한다', () => {
    const serverOptions = highlightServerQueries.list(PARAMS);
    const clientOptions = highlightQueries.list(PARAMS);

    expect(serverOptions.queryKey).toEqual(clientOptions.queryKey);
    expect(serverOptions.staleTime).toBe(clientOptions.staleTime);
  });

  it('isSuccess:true면 ServerApiResult를 언랩해 HighlightListDTO를 반환한다', async () => {
    const dto = buildHighlightListDTO([buildHighlightDTO()]);
    vi.mocked(fetchHighlightList).mockResolvedValue({ isSuccess: true, status: 200, data: dto });

    const result = await new QueryClient().fetchQuery(highlightServerQueries.list(PARAMS));

    expect(result).toEqual(dto);
    expect(fetchHighlightList).toHaveBeenCalledWith({ ...PARAMS, size: 9 });
  });

  it('isSuccess:false면 throw해 fetchQuery가 reject된다', async () => {
    vi.mocked(fetchHighlightList).mockResolvedValue({
      isSuccess: false,
      status: 500,
      data: { code: 'INTERNAL_SERVER_ERROR', message: '서버 내부 오류입니다.' },
    });

    await expect(new QueryClient().fetchQuery(highlightServerQueries.list(PARAMS))).rejects.toThrow(
      '서버 내부 오류입니다.'
    );
  });
});
