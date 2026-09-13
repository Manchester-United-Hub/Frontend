/**
 * useSuspensePlayerList 훅 단위 테스트 — useQuery → useSuspenseQuery 전환 회귀 가드.
 *
 * useSuspenseQuery는 에러를 isError가 아니라 렌더 중 throw로 알리므로, 훅 자체를 목킹하면
 * 이번 전환의 본질이 검증에서 사라진다. 그래서 실 QueryClient(retry:false, gcTime:0)를 쓰고
 * @entities/player/api/client의 getPlayerList만 vi.mock한다. 첫 렌더가 suspend하므로
 * Suspense + ErrorBoundary로 감싸고 waitFor로 전이를 기다린다.
 *
 * src가 `.ts`이므로 테스트도 `.ts`로 두고, 래퍼는 usePlayerProfile.test.ts처럼
 * React.createElement로 만든다(JSX 금지).
 *
 * 검증 목적:
 * - 성공 시 getPlayerList 응답을 언랩한 PlyaerListDTO가 data로 노출된다
 * - playerQueries.list(query).queryKey로 캐시에 저장된다
 * - BFF success:false 응답이 isError 전이가 아니라 렌더 중 throw로 에러 경계에 잡힌다
 *   (useQuery로 되돌아가면 이 케이스가 실패하는 회귀 가드)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, screen, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import React, { Suspense } from 'react';

import { useSuspensePlayerList } from '@features/player/api/useSuspensePlayerList';
import { playerQueries } from '@features/player/api/playerQueries';
import { getPlayerList } from '@entities/player/api/client';
import { ErrorBoundary } from '@shared/ui';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@entities/player/api/client', () => ({
  getPlayerList: vi.fn(),
}));

const QUERY = { season: 2026, size: 100 };
const PLAYER_LIST = buildPlayerListDTO([buildPlayerDTO()]);
const ERROR_FALLBACK_TEXT = '__useSuspensePlayerList 에러 경계 fallback__';

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
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      // ErrorBoundaryProps.children은 필수 prop이라 React.createElement의 rest 인자로는
      // 타입이 맞지 않는다(파일이 .ts라 JSX를 쓸 수 없다) — props 객체로 명시한다.
      // eslint-disable-next-line react/no-children-prop
      React.createElement(ErrorBoundary, {
        fallback: () => ERROR_FALLBACK_TEXT,
        children: React.createElement(Suspense, { fallback: null }, children),
      })
    );

  return { queryClient, wrapper };
};

describe('useSuspensePlayerList', () => {
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
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useSuspensePlayerList(QUERY), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(PLAYER_LIST));
    expect(getPlayerList).toHaveBeenCalledWith(QUERY);
  });

  it('playerQueries.list(query).queryKey로 캐시에 저장된다', async () => {
    vi.mocked(getPlayerList).mockResolvedValue(successResponse());
    const { queryClient, wrapper } = createWrapper();

    renderHook(() => useSuspensePlayerList(QUERY), { wrapper });

    await waitFor(() =>
      expect(queryClient.getQueryData(playerQueries.list(QUERY).queryKey)).toEqual(PLAYER_LIST)
    );
  });

  it('BFF success:false 응답이 isError 전이가 아니라 렌더 중 throw로 에러 경계에 잡힌다(useQuery 회귀 가드)', async () => {
    vi.mocked(getPlayerList).mockResolvedValue(errorResponse());
    const { wrapper } = createWrapper();

    renderHook(() => useSuspensePlayerList(QUERY), { wrapper });

    await waitFor(() => expect(screen.getByText(ERROR_FALLBACK_TEXT)).toBeInTheDocument());
  });
});
