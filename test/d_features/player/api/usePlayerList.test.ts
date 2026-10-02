/**
 * usePlayerList 훅 단위 테스트 — useQuery 계약 회귀 가드.
 *
 * 이 훅의 소비자(RosterPanel)는 Suspense·ErrorBoundary 없이 isLoading·isError 분기로
 * 로딩·에러 UI를 직접 그린다. 훅을 useSuspenseQuery로 바꾸면 isError가 영구히 false가 되고
 * 에러는 렌더 중 throw로 경계 없는 트리를 빠져나가 페이지가 통째로 죽는다 — 그 회귀를
 * 잡으려고 훅을 목킹하지 않고 실 QueryClient + @entities/player/api/client만 vi.mock한다.
 *
 * Suspense 판이 필요한 소비자는 useSuspensePlayerList를 쓴다(별도 테스트 파일).
 *
 * src가 `.ts`이므로 테스트도 `.ts`로 두고, 래퍼는 usePlayerProfile.test.ts처럼
 * React.createElement로 만든다(JSX 금지).
 *
 * 검증 목적:
 * - 성공 시 getPlayerList 응답을 언랩한 PlyaerListDTO가 data로 노출된다
 * - BFF success:false 응답이 렌더 중 throw가 아니라 isError 전이로 보고된다
 *   (useSuspenseQuery로 바꾸면 이 케이스가 실패하는 회귀 가드)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { usePlayerList } from '@features/player/api/usePlayerList';
import { getPlayerList } from '@entities/player/api/client';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@entities/player/api/client', () => ({
  getPlayerList: vi.fn(),
}));

const QUERY = { season: 2026, size: 100 };
const PLAYER_LIST = buildPlayerListDTO([buildPlayerDTO()]);

const successResponse = () =>
  ({
    success: true,
    data: PLAYER_LIST,
    error: null,
  }) as Awaited<ReturnType<typeof getPlayerList>>;

const errorResponse = () =>
  ({
    success: false,
    data: null,
    error: { code: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
  }) as Awaited<ReturnType<typeof getPlayerList>>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  return wrapper;
};

describe('usePlayerList', () => {
  beforeEach(() => {
    vi.mocked(getPlayerList).mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('성공 시 getPlayerList 응답을 언랩한 PlyaerListDTO가 data로 노출된다', async () => {
    vi.mocked(getPlayerList).mockResolvedValue(successResponse());

    const { result } = renderHook(() => usePlayerList(QUERY), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toEqual(PLAYER_LIST));
    expect(getPlayerList).toHaveBeenCalledWith(QUERY);
  });

  it('BFF success:false 응답이 throw가 아니라 isError 전이로 보고된다(Suspense 전환 회귀 가드)', async () => {
    vi.mocked(getPlayerList).mockResolvedValue(errorResponse());

    const { result } = renderHook(() => usePlayerList(QUERY), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
