/**
 * StandingsTab 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: usePLRankList(react-query)로 순위표 데이터를 가져와 패널 헤더·
 * 순위표·존 범례를 렌더하는가. `@entities/rank/api`의 `fetchPremierLeagueRankList`를
 * vi.mock하고 QueryClientProvider로 감싸 렌더한다(MatchTab.test.tsx 패턴).
 *
 * StandingsTab.tsx는 로딩(StandingSkeleton, role=status)/에러(StateBox,
 * role=alert)/성공 3분기를 가지며, 형제 컴포넌트 MatchesTab과 동일한 패턴으로
 * 3분기 전부를 커버한다(M-6).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { StandingsTab } from '@pages/season/ui/StandingsTab';
import { fetchPremierLeagueRankList } from '@entities/rank/api';

import { standings } from '../../model/mockData';

vi.mock('@entities/rank/api', () => ({
  fetchPremierLeagueRankList: vi.fn(),
}));

function renderStandingsTab(season: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <StandingsTab season={season} />
    </QueryClientProvider>
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('StandingsTab', () => {
  it('패널 헤더·순위표·존 범례를 모두 렌더한다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue({
      success: true,
      data: standings,
      error: null,
    });

    renderStandingsTab('2025-26');

    await waitFor(() =>
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    );

    expect(
      screen.getByRole('heading', { level: 2, name: '순위표' })
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: '순위표 존 범례' })
    ).toBeInTheDocument();
  });

  it('로딩 중에는 스켈레톤(role=status)이 렌더된다', () => {
    vi.mocked(fetchPremierLeagueRankList).mockReturnValue(
      new Promise(() => {})
    );

    renderStandingsTab('2025-26');

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('에러 응답이면 StateBox(role=alert)와 안내 문구가 렌더된다', async () => {
    vi.mocked(fetchPremierLeagueRankList).mockResolvedValue({
      success: false,
      data: null,
      error: { code: 'BFF_ERROR', message: '시즌 순위표를 불러오지 못했어요' },
    });

    renderStandingsTab('2025-26');

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { name: '시즌 순위표를 불러오지 못했어요' })
    ).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument();
  });
});
