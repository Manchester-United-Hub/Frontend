/**
 * / 라우트 페이지 테스트 (ST-004).
 *
 * Home은 Next 16 async 서버 컴포넌트(getSeasonInfo → prefetchQuery → dehydrate/
 * HydrationBoundary)라, news route 선례(test/app/news/page.test.tsx)와 동일하게
 * `render(<QueryClientProvider>{await Home()}</QueryClientProvider>)` 형태로 렌더한다.
 *
 * 서버 경로는 각 모듈 경계에서 mock한다 — getSeasonInfo·getPlayerRoster 모두 'use cache'와
 * React cache()로 감싸여 있어 fetch 계층에서 mock하면 테스트 간 메모이제이션이 샌다.
 *
 * 검증 목적:
 * - 서버가 확정한 season이 프리페치 쿼리와 LandingPage에 그대로 전달된다
 * - 프리페치 성공 시 초기 렌더에서 곧바로 카드가 보이고 클라이언트가 재페칭하지 않는다
 *   (= 서버·클라이언트 queryKey가 일치해 hydration이 성립한다는 증거)
 * - 프리페치 실패 시 페이지가 throw하지 않고 클라이언트 BFF 경로가 이어받는다
 * - ISR 설정이 유지된다(revalidate 양수, force-dynamic 미사용)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom/vitest';
import React from 'react';

afterEach(cleanup);

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

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@entities/seasonInfo/api/server', () => ({
  getSeasonInfo: vi.fn(),
}));

vi.mock('@features/player/api/getPlayerRoster', () => ({
  getPlayerRoster: vi.fn(),
}));

vi.mock('@entities/player/api/client', () => ({
  getPlayerList: vi.fn(),
  getPlayerProfile: vi.fn(),
  getPlayerStatistics: vi.fn(),
}));

import Home, * as homeRoute from '@app/page';
import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import { getPlayerRoster } from '@features/player/api/getPlayerRoster';
import { getPlayerList } from '@entities/player/api/client';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';
import type { PlyaerListDTO } from '@entities/player/model';

const SEASON_START_YEAR = 2026;
/** rosterListQuery가 만드는 size — MAX_PAGE_SIZE. */
const ROSTER_PAGE_SIZE = 100;

const SQUAD_DTO = buildPlayerListDTO([
  buildPlayerDTO({ id: 1, name: '브루누', number: 8 }),
  buildPlayerDTO({ id: 2, name: '가르나초', number: 17 }),
]);

const bffSuccessResponse = (data: PlyaerListDTO) =>
  ({ success: true, data, error: null }) as const;

const renderHome = async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={queryClient}>{await Home()}</QueryClientProvider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getSeasonInfo).mockResolvedValue({
    startYear: SEASON_START_YEAR,
    label: '2026/27',
    status: 'ongoing',
  });
});

describe('/ route page', () => {
  it('서버가 확정한 season으로 스쿼드를 프리페치한다', async () => {
    vi.mocked(getPlayerRoster).mockResolvedValue(SQUAD_DTO);

    await renderHome();

    expect(getPlayerRoster).toHaveBeenCalledWith({
      season: SEASON_START_YEAR,
      size: ROSTER_PAGE_SIZE,
    });
  });

  it('프리페치가 성공하면 초기 렌더에서 곧바로 카드가 보이고 클라이언트가 다시 페칭하지 않는다', async () => {
    vi.mocked(getPlayerRoster).mockResolvedValue(SQUAD_DTO);

    const { container } = await renderHome();

    // waitFor 없이 동기 단언 — 서버·클라이언트 queryKey가 어긋나면 이 시점에 스켈레톤만 보인다.
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /브루누/ })).toHaveAttribute(
      'href',
      '/players/1'
    );
    // staleTime(3_600_000ms) 안이므로 마운트 시 재페칭하지 않는다 — hydration 성립의 증거.
    expect(getPlayerList).not.toHaveBeenCalled();
  });

  it('프리페치가 실패해도 페이지는 throw하지 않고 클라이언트가 이어받는다(graceful degradation)', async () => {
    vi.mocked(getPlayerRoster).mockResolvedValue(null);
    vi.mocked(getPlayerList).mockResolvedValue(bffSuccessResponse(SQUAD_DTO));

    await renderHome();

    // 실패한 쿼리는 dehydrate 대상에서 제외되므로 초기 렌더에는 카드가 없다(스켈레톤 구간).
    // 페이지 자체는 throw하지 않고 헤더까지 렌더된다.
    expect(screen.getByText('1군 스쿼드')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /브루누/ })).toBeNull();

    await waitFor(() =>
      expect(screen.getByRole('link', { name: /브루누/ })).toBeInTheDocument()
    );
    expect(getPlayerList).toHaveBeenCalled();
  });

  it('ISR 설정을 유지한다 — revalidate 양수, force-dynamic 미사용', () => {
    expect(homeRoute.revalidate).toBeGreaterThan(0);
    expect(homeRoute).not.toHaveProperty('dynamic');
  });
});
