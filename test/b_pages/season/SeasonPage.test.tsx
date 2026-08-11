/**
 * SeasonPage 통합 테스트 — QA 검증. clubInfo `ClubPage.test.tsx` 패턴을 미러링했다.
 *
 * ST-5(T-5): `@entities/matches/api`의 `getMatchScheduleList`를 vi.mock하고
 * QueryClientProvider로 감싸 렌더한다(EndPointPanel.test.tsx/MatchTab.test.tsx 패턴) —
 * SeasonPage → SeasonTabs → MatchesTab → useMatchFilters → useMatchScheduleList
 * → useQuery 경로가 실 비동기 데이터를 소비하기 때문.
 *
 * ST-A2: 순위표 탭은 SeasonTabs → StandingsTab → usePLRankList →
 * `@entities/rank/api`의 `fetchPremierLeagueRankList`를 소비하므로 동일한 이유로
 * 함께 vi.mock한다(architecture.standards — API 모킹 경계는 엔티티 client 계층).
 * `matches`는 공유 `./model/mockData`에서 가져오고, `standings`는 이 파일 전용
 * inline 상수로 둔다(rank 계층은 기존 matches 관례대로 파일별 inline fixture).
 *
 * season-ssr: 현재 시즌은 SSR(`app/season/page.tsx`)에서 조회해 `season` prop으로
 * 내려온다. `SeasonPage`는 순수 조립 컴포넌트라 currentSeason 관련 모킹은 불필요하다.
 *
 * 검증 목적:
 * - 런타임 에러 없이 마운트, 히어로·요약 카드 렌더
 * - 초기 탭 = matches(일정 & 결과)
 * - 탭 접근성 계약: role=tablist/tab/tabpanel, aria-selected/aria-controls/aria-labelledby 짝
 * - 순위표 탭 전환 시 테이블 렌더
 * - 필터 적용 시 일정 패널 내 행 수가 줄어든다
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SeasonPage } from '@pages/season';
import { getMatchScheduleList } from '@entities/matches/api';
import { fetchPremierLeagueRankList } from '@entities/rank/api';
import type { Standing } from '@entities/rank/model';
import { matches } from './model/mockData';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

vi.mock('@entities/rank/api', () => ({
  fetchPremierLeagueRankList: vi.fn(),
}));

const standings: Standing[] = [
  {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    pos: 1,
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    p: 30,
    w: 22,
    d: 4,
    l: 4,
    gf: 60,
    ga: 25,
    pts: 70,
    form: ['W', 'W', 'D', 'W', 'L'],
    mv: 'same',
    zone: 'ucl',
    diff: 35,
    utd: true,
  },
];

// --- 헬퍼 ---

const TEST_SEASON = '2025-26';

function renderSeasonPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <SeasonPage season={TEST_SEASON} />
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
  vi.mocked(fetchPremierLeagueRankList).mockResolvedValue({
    success: true,
    data: standings,
    error: null,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// --- 테스트 ---

describe('SeasonPage 스모크', () => {
  it('런타임 에러 없이 마운트되고 <main> 존재', async () => {
    const { container } = renderSeasonPage();
    expect(container.querySelector('main')).not.toBeNull();
    await waitForMatchesLoaded();
  });

  it('히어로(h1 "시즌")와 요약 카드 4개가 렌더된다', async () => {
    renderSeasonPage();
    expect(
      screen.getByRole('heading', { level: 1, name: '시즌' })
    ).toBeInTheDocument();
    const summaryList = screen.getByRole('list', { name: '시즌 요약 정보' });
    expect(within(summaryList).getAllByRole('listitem')).toHaveLength(4);
    await waitForMatchesLoaded();
  });

  it('초기 탭은 matches — "일정 & 결과" 패널이 기본 렌더된다', async () => {
    renderSeasonPage();
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '일정 & 결과' })
    ).toBeInTheDocument();
    await waitForMatchesLoaded();
  });

  it('tablist/tab 개수 = 2, tabpanel 1개만 렌더', async () => {
    renderSeasonPage();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    await waitForMatchesLoaded();
  });
});

describe('SeasonPage 서브탭 전환·필터', () => {
  it('순위표 탭 클릭 시 tab/tabpanel 접근성 계약이 짝을 이루고 테이블이 렌더된다', async () => {
    const user = userEvent.setup();
    renderSeasonPage();
    await waitForMatchesLoaded();

    const tableTab = screen.getByRole('tab', { name: /순위표/ });
    expect(tableTab).toHaveAttribute('id', 'tab-table');
    expect(tableTab).toHaveAttribute('aria-controls', 'panel-table');

    await user.click(tableTab);

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'panel-table');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-table');

    await waitForMatchesLoaded();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('홈 필터를 선택하면 일정 패널의 행 수가 줄어든다', async () => {
    const user = userEvent.setup();
    renderSeasonPage();
    await waitForMatchesLoaded();

    const panel = screen.getByRole('tabpanel');
    const before = within(panel).getAllByRole('listitem').length;

    await user.click(screen.getByRole('button', { name: '홈' }));

    const homeCount = matches.filter((match) => match.ha === 'home').length;
    await waitFor(() => {
      expect(within(panel).getAllByRole('listitem')).toHaveLength(homeCount);
    });
    const after = within(panel).getAllByRole('listitem').length;
    expect(after).toBeLessThan(before);
    expect(after).toBeGreaterThan(0);
  });

  it('연속으로 탭을 오가도 매번 정확히 1개 tabpanel만 남는다(연속 동작 일관성)', async () => {
    const user = userEvent.setup();
    renderSeasonPage();
    await waitForMatchesLoaded();

    const order = [/순위표/, /일정/, /순위표/, /일정/];
    for (const name of order) {
      await user.click(screen.getByRole('tab', { name }));
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    }
    expect(screen.getByRole('tab', { name: /일정/ })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(
      screen.getByRole('heading', { level: 2, name: '일정 & 결과' })
    ).toBeInTheDocument();
  });
});
