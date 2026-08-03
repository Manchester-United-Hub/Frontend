/**
 * MatchesTab 통합 테스트 — 실 API 흐름(로딩/에러/빈상태/성공) 검증.
 * `@entities/matches/api`의 `getMatchScheduleList`를 vi.mock하고
 * QueryClientProvider로 감싸 렌더한다(EndPointPanel.test.tsx 패턴, T-6).
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
import { matches } from '../../model/mockData';

vi.mock('@entities/matches/api', () => ({
  getMatchScheduleList: vi.fn(),
}));

// --- 헬퍼 ---

function renderMatchesTab() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MatchesTab />
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
