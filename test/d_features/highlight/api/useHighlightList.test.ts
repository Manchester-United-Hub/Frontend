import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useHighlightList } from '@features/highlight/api/useHighlightList';
import { getHighlightList } from '@entities/highlight/api/client';
import { buildHighlightDTO, buildHighlightListDTO } from '@test/fixtures/highlights';

vi.mock('@entities/highlight/api/client', () => ({
  getHighlightList: vi.fn(),
}));

const PARAMS = { season: 2026, sort: 'LATEST', page: 0 } as const;
const LIST_DTO = buildHighlightListDTO([buildHighlightDTO()]);

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useHighlightList', () => {
  beforeEach(() => vi.mocked(getHighlightList).mockReset());
  afterEach(cleanup);

  it('성공 응답을 언랩한 HighlightListDTO를 data로 노출한다', async () => {
    vi.mocked(getHighlightList).mockResolvedValue({ success: true, data: LIST_DTO, error: null });

    const { result } = renderHook(() => useHighlightList(PARAMS), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(LIST_DTO);
  });

  it('success:false 응답은 렌더 중 throw가 아니라 isError로 보고한다', async () => {
    vi.mocked(getHighlightList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
    });

    const { result } = renderHook(() => useHighlightList(PARAMS), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('서버 오류');
  });
});
