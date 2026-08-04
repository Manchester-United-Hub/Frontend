/**
 * MatchesTab 통합 테스트 — 실 API 흐름(로딩/에러/빈상태/성공) 검증.
 * `@entities/matches/api`의 `getMatchScheduleList`를 vi.mock하고
 * QueryClientProvider로 감싸 렌더한다(EndPointPanel.test.tsx 패턴, T-6).
 *
 * D-10/ST-A4: `MatchesTab`에 `season` prop이 추가됐다(감사 이후 src 변경).
 * `matches` fixture는 이 파일 전용 inline 상수로 둔다. SeasonPage.test.tsx·
 * SeasonTabs.test.tsx는 동일한 데이터를 공유 `test/b_pages/season/model/mockData.ts`의
 * `matches`에서 import하지만, 이 파일은 병렬 작업 당시 파일 경계 독립성을 위해
 * inline을 유지했다 — 중복 제거는 후속 과제(decisions.md D-11).
 *
 * 검증 목적:
 * - 로딩 중에는 MatchesSkeleton(role=status)이 렌더된다
 * - 에러 시 StateBox(role=alert)와 안내 문구가 렌더된다
 * - 성공 + 빈 배열이면 기존 빈 상태 문구가 렌더된다
 * - 성공 + 데이터면 홈 필터 적용 시 행 수가 줄어든다
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MatchesTab } from '@pages/season/ui/MatchesTab';
import { getMatchScheduleList } from '@entities/matches/api';
import type { Match } from '@entities/matches/model';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

const season = '2026-27';

const matches: Match[] = [
  {
    id: 'f1',
    month: 'M1',
    date: '3/1',
    dow: '토',
    ha: 'home',
    home: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MUN',
      nm: '맨체스터 유나이티드',
      score: 3,
      utd: true,
    },
    away: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'EVE',
      nm: '에버턴',
      score: 0,
    },
    status: 'past',
    result: 'W',
    venue: '올드 트래포드',
    kickoff: '2025-03-01T15:00',
  },
  {
    id: 'f2',
    month: 'M1',
    date: '3/8',
    dow: '토',
    ha: 'away',
    home: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'BHA',
      nm: '브라이턴',
      score: 1,
    },
    away: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MUN',
      nm: '맨체스터 유나이티드',
      score: 2,
      utd: true,
    },
    status: 'past',
    result: 'W',
    venue: '아멕스 스타디움',
    kickoff: '2025-03-08T20:00',
  },
  {
    id: 'f3',
    month: 'M2',
    date: '3/29',
    dow: '토',
    ha: 'home',
    home: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MUN',
      nm: '맨체스터 유나이티드',
      score: 1,
      utd: true,
    },
    away: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'RMA',
      nm: '레알 마드리드',
      score: 1,
    },
    status: 'past',
    result: 'D',
    venue: '올드 트래포드',
    kickoff: '2025-03-29T20:00',
  },
  {
    id: 'f4',
    month: 'M2',
    date: '4/5',
    dow: '토',
    ha: 'away',
    home: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'NEW',
      nm: '뉴캐슬',
      score: 1,
    },
    away: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MUN',
      nm: '맨체스터 유나이티드',
      score: 2,
      utd: true,
    },
    status: 'past',
    result: 'W',
    venue: '세인트 제임스 파크',
    kickoff: '2025-04-05T15:00',
  },
  {
    id: 'f5',
    month: 'M3',
    date: '5/31',
    dow: '토',
    ha: 'neutral',
    home: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MUN',
      nm: '맨체스터 유나이티드',
      utd: true,
    },
    away: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MCI',
      nm: '맨체스터 시티',
    },
    status: 'upcoming',
    time: '01:00 KST',
    venue: '웸블리 스타디움',
    kickoff: '2025-05-31T01:00',
  },
];

// --- 헬퍼 ---

function renderMatchesTab() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MatchesTab season={season} />
    </QueryClientProvider>
  );
}

const successResponse = (data: Match[]) => ({
  success: true as const,
  data,
  error: null,
});

const errorResponse = {
  success: false as const,
  data: null,
  error: { code: 'BFF_ERROR', message: '경기 일정을 불러오지 못했어요' },
};

const rowCount = () => screen.getAllByRole('listitem').length;

// --- 생명주기 ---

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// --- 테스트 ---

describe('MatchesTab', () => {
  it('로딩 중에는 스켈레톤(role=status)이 렌더된다', () => {
    vi.mocked(getMatchScheduleList).mockReturnValue(new Promise(() => {}));

    renderMatchesTab();

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('에러 응답이면 StateBox(role=alert)와 안내 문구가 렌더된다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(errorResponse);

    renderMatchesTab();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(
      screen.getByRole('heading', { name: '경기 일정을 불러오지 못했어요' })
    ).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument();
  });

  it('성공 + 빈 배열이면 기존 빈 상태 문구가 렌더된다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(successResponse([]));

    renderMatchesTab();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: '조건에 맞는 경기가 없어요' })
      ).toBeInTheDocument();
    });
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('성공 + 데이터면 초기 전체 렌더 후 홈 필터로 행 수가 줄어든다', async () => {
    vi.mocked(getMatchScheduleList).mockResolvedValue(successResponse(matches));
    const user = userEvent.setup();

    renderMatchesTab();

    await waitFor(() => expect(rowCount()).toBe(matches.length));

    await user.click(screen.getByRole('button', { name: '홈' }));

    const homeCount = matches.filter((match) => match.ha === 'home').length;
    await waitFor(() => expect(rowCount()).toBe(homeCount));
  });
});
