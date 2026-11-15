import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { getHighlightList } from '@entities/highlight/api/client';
import type { HighlightListQueryDTO } from '@entities/highlight/model';
import { useHighlights } from '@pages/highlights/model';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/highlight/api/client', () => ({
  getHighlightList: vi.fn(),
}));

const SEASON = 2026;
const PAGE_SIZE = 9;
const LIST_META = { totalElements: 12, totalPages: 2 };

const toDTOs = (ids: string[]) => ids.map((id) => buildHighlightDTO({ videoId: id, title: `${id} | Highlights` }));

const RESPONSES: Record<string, ReturnType<typeof buildHighlightListDTO>> = {
  'LATEST-0': buildHighlightListDTO(toDTOs(['L1', 'L2', 'L3']), LIST_META),
  'LATEST-1': buildHighlightListDTO(toDTOs(['L10', 'L11']), { ...LIST_META, page: 1 }),
  'VIEW_COUNT-0': buildHighlightListDTO(toDTOs(['V1', 'V2']), LIST_META),
};

const respondByQuery = async ({ sort, page }: HighlightListQueryDTO) => ({
  success: true as const,
  data: RESPONSES[`${sort}-${page}`],
  error: null,
});

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

const renderLoaded = async (options: { showFeatured?: boolean } = {}) => {
  const rendered = renderHook(() => useHighlights({ season: SEASON, ...options }), {
    wrapper: createWrapper(),
  });
  await waitFor(() => expect(rendered.result.current.isLoading).toBe(false));
  return rendered;
};

const idsOf = (items: { id: string }[]) => items.map((item) => item.id);

describe('useHighlights', () => {
  beforeEach(() => {
    vi.mocked(getHighlightList).mockImplementation(respondByQuery);
  });
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('최신순 1페이지(page 0)를 페이지 크기 9로 조회한다', async () => {
    await renderLoaded();

    expect(getHighlightList).toHaveBeenCalledWith({ season: SEASON, sort: 'LATEST', page: 0, size: PAGE_SIZE });
  });

  it('1페이지는 첫 영상을 대표로, 나머지를 그리드로 나누고 전체 개수·페이지 수는 응답 값을 쓴다', async () => {
    const { result } = await renderLoaded();

    expect(result.current.featured?.id).toBe('L1');
    expect(idsOf(result.current.pageItems)).toEqual(['L2', 'L3']);
    expect(result.current.totalCount).toBe(12);
    expect(result.current.totalPages).toBe(2);
  });

  it('2페이지로 이동하면 page 1을 조회하고 대표 없이 응답 전체를 그리드로 보여준다', async () => {
    const { result } = await renderLoaded();

    act(() => result.current.goToPage(2));

    await waitFor(() => expect(idsOf(result.current.pageItems)).toEqual(['L10', 'L11']));
    expect(result.current.page).toBe(2);
    expect(result.current.featured).toBeUndefined();
    expect(getHighlightList).toHaveBeenLastCalledWith({ season: SEASON, sort: 'LATEST', page: 1, size: PAGE_SIZE });
  });

  it('정렬을 조회순으로 바꾸면 페이지를 1로 되돌리고 VIEW_COUNT 1페이지의 첫 영상이 대표가 된다', async () => {
    const { result } = await renderLoaded();
    act(() => result.current.goToPage(2));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.changeSort('VIEW_COUNT'));

    await waitFor(() => expect(result.current.featured?.id).toBe('V1'));
    expect(result.current.page).toBe(1);
    expect(result.current.sortKey).toBe('VIEW_COUNT');
    expect(idsOf(result.current.pageItems)).toEqual(['V2']);
    expect(getHighlightList).toHaveBeenLastCalledWith({ season: SEASON, sort: 'VIEW_COUNT', page: 0, size: PAGE_SIZE });
  });

  it('showFeatured=false면 1페이지도 대표 없이 응답 전체를 그리드로 보여준다', async () => {
    const { result } = await renderLoaded({ showFeatured: false });

    expect(result.current.featured).toBeUndefined();
    expect(idsOf(result.current.pageItems)).toEqual(['L1', 'L2', 'L3']);
  });

  it('조회에 실패하면 isError가 true이고 refetch로 다시 조회한다', async () => {
    vi.mocked(getHighlightList).mockResolvedValueOnce({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });
    const { result } = renderHook(() => useHighlights({ season: SEASON }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));

    act(() => result.current.refetch());

    await waitFor(() => expect(result.current.isError).toBe(false));
    expect(getHighlightList).toHaveBeenCalledTimes(2);
    expect(result.current.featured?.id).toBe('L1');
  });
});
