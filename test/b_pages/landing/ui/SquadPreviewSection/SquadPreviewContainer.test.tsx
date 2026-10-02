/**
 * SquadPreviewContainer 통합 테스트.
 *
 * 컨테이너의 책임은 껍데기(section·헤더)와 경계(Suspense·ErrorBoundary)라, 훅을 목킹하면
 * 정작 검증할 것이 사라진다. 그래서 실제 QueryClient를 쓰고 BFF 클라이언트
 * (@entities/player/api/client)만 목킹해 suspend→resolve/reject 전이를 그대로 태운다.
 *
 * 검증 목적:
 * - 조회가 끝나기 전에도 헤더는 남고, 스켈레톤 카드가 프리뷰 건수만큼 렌더된다
 *   (회귀 가드: Array(n).map은 hole을 건너뛰어 fallback이 빈 div가 된다)
 * - 조회 성공 → 카드 렌더
 * - 조회 실패 → ErrorBoundary가 RosterErrorState를 렌더하고, "다시 시도"로 복구된다
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={String(href)} className={className}>
      {children}
    </a>
  ),
}));

import { getPlayerList } from '@entities/player/api/client';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

vi.mock('@entities/player/api/client', async () => {
  const actual =
    await vi.importActual<typeof import('@entities/player/api/client')>(
      '@entities/player/api/client'
    );
  return { ...actual, getPlayerList: vi.fn() };
});

import { SquadPreviewContainer } from '@pages/landing/ui/SquadPreviewSection';

const mockedGetPlayerList = vi.mocked(getPlayerList);

const SEASON = 2026;
/** Suspense fallback이 그리는 스켈레톤 카드 수 — 상수 import 없이 리터럴로 고정한다. */
const SKELETON_CARD_COUNT = 4;

const PLAYERS = [
  buildPlayerDTO({ id: 1, name: '브루누', number: 8 }),
  buildPlayerDTO({ id: 2, name: '가르나초', number: 17 }),
];

const successResponse = () =>
  ({
    success: true,
    data: buildPlayerListDTO(PLAYERS),
    error: null,
  }) as Awaited<ReturnType<typeof getPlayerList>>;

const errorResponse = () =>
  ({
    success: false,
    data: null,
    error: { code: 'BFF_ERROR', message: '조회 실패' },
  }) as Awaited<ReturnType<typeof getPlayerList>>;

const renderContainer = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <SquadPreviewContainer season={SEASON} />
    </QueryClientProvider>
  );
};

beforeEach(() => {
  mockedGetPlayerList.mockReset();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('SquadPreviewContainer', () => {
  it('조회 중에도 헤더를 유지하고 스켈레톤 카드를 렌더한다', () => {
    mockedGetPlayerList.mockReturnValue(new Promise(() => {}));

    const { container } = renderContainer();

    expect(
      screen.getByRole('heading', { name: '1군 스쿼드' })
    ).toBeInTheDocument();
    expect(container.querySelector('.grid')?.childElementCount).toBe(
      SKELETON_CARD_COUNT
    );
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('조회에 성공하면 선수 카드를 렌더한다', async () => {
    mockedGetPlayerList.mockResolvedValue(successResponse());

    renderContainer();

    expect(await screen.findAllByRole('listitem')).toHaveLength(PLAYERS.length);
  });

  it('조회에 실패하면 에러 상태를 렌더하고 "다시 시도"로 복구된다', async () => {
    mockedGetPlayerList.mockResolvedValueOnce(errorResponse());
    mockedGetPlayerList.mockResolvedValue(successResponse());
    const user = userEvent.setup();

    renderContainer();
    await user.click(await screen.findByRole('button', { name: '다시 시도' }));

    expect(await screen.findAllByRole('listitem')).toHaveLength(PLAYERS.length);
  });
});
