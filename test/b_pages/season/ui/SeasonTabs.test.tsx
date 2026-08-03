/**
 * SeasonTabs 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * D-15/ST-5: `@entities/matches/api`의 `getMatchScheduleList`를 vi.mock하고
 * QueryClientProvider로 감싸 렌더한다(SeasonPage.test.tsx/MatchTab.test.tsx와 동일
 * 패턴) — SeasonTabs → MatchesTab → useMatchFilters → useMatchScheduleList →
 * useQuery 경로가 실 비동기 데이터를 소비하기 때문(SeasonPage.test.tsx와 근본 원인 동일).
 *
 * 검증 목적: 기본 활성 탭(matches), 탭 전환(일정↔순위표), 접근성 계약
 * (id="tab-{id}"/aria-controls ↔ id="panel-{id}"/aria-labelledby), 탭 전환 시
 * 항상 정확히 1개 tabpanel만 렌더.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SeasonTabs } from '@pages/season/ui/SeasonTabs';
import { getMatchScheduleList } from '@entities/matches/api';
import { matches } from '../model/mockData';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

// --- 헬퍼 ---

function renderSeasonTabs() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <SeasonTabs />
    </QueryClientProvider>
  );
}

async function waitForMatchesLoaded() {
  await waitFor(() => {
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
}

// --- 생명주기 ---

beforeEach(() => {
  vi.mocked(getMatchScheduleList).mockResolvedValue({
    success: true,
    data: matches,
    error: null,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// --- 테스트 ---

describe('SeasonTabs', () => {
  it('기본 활성 탭은 matches — "일정 & 결과" 패널이 렌더된다', async () => {
    renderSeasonTabs();
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '일정 & 결과' })
    ).toBeInTheDocument();
    await waitForMatchesLoaded();
  });

  it('순위표 탭 클릭 시 StandingsTab(테이블) 패널로 전환된다', async () => {
    const user = userEvent.setup();
    renderSeasonTabs();
    await waitForMatchesLoaded();

    await user.click(screen.getByRole('tab', { name: /순위표/ }));

    expect(screen.getByRole('tab', { name: /순위표/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '순위표' })
    ).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('탭의 id/aria-controls가 대응 tabpanel의 id/aria-labelledby와 짝을 이룬다', async () => {
    const user = userEvent.setup();
    renderSeasonTabs();
    await waitForMatchesLoaded();

    const tableTab = screen.getByRole('tab', { name: /순위표/ });
    expect(tableTab).toHaveAttribute('id', 'tab-table');
    expect(tableTab).toHaveAttribute('aria-controls', 'panel-table');

    await user.click(tableTab);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-table');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-table');
  });

  it('탭을 오가도 항상 정확히 1개의 tabpanel만 렌더된다', async () => {
    const user = userEvent.setup();
    renderSeasonTabs();
    await waitForMatchesLoaded();

    await user.click(screen.getByRole('tab', { name: /순위표/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

    await user.click(screen.getByRole('tab', { name: /일정/ }));
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 2, name: '일정 & 결과' })
    ).toBeInTheDocument();
  });
});
