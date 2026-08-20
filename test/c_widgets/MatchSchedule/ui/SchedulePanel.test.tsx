/**
 * SchedulePanel 테스트 — S2-13. (StandingsPanel.test.tsx와 같은 주석 규약)
 * render(<SchedulePanel/>)는 하지 않는다. 컴포넌트 본문을 Node에서 실행(await)하고
 * 반환된 React element를 검사한다. 실패 분기의 반환 트리(Shell > StateBox)에는 async
 * 컴포넌트가 없으므로 RTL로 렌더해 사용자에게 보이는 것을 그대로 단언한다(S2-13 3-a).
 * 성공 분기는 자식(MatchesTab)이 자기 테스트로 이미 덮여 있으므로 element.type과
 * props 배선만 단언한다(S2-13 3-b) — 같은 렌더를 두 번 검증하지 않는다.
 *
 * ⚠️ S2-13 (4) — next/server의 connection()을 mock한다. 아래 "connection()이 호출된다"
 * 단언은 그 호출의 존재만 고정할 뿐, /season이 실제로 동적 렌더(ƒ)가 되는 효과를
 * 증명하지 않는다. 효과 검증은 next build의 라우트 심볼(/season = ƒ)이 정본이며 두
 * 게이트는 서로를 대체하지 않는다. 다만 이 단언은 "await connection() 한 줄이 실수로
 * 지워지는" 사고(R2-6·D-10 회귀)에 대한 최초의 자동 게이트다 — 지금까지 방어는 주석과
 * 사람 눈뿐이었고, 그 눈은 F-20(rtk next build 무언의 실패)으로 멀 수 있다.
 *
 * F-27: 이 분기는 이 파일이 생기기 전까지 성공·실패 어느 쪽도 실행되지 않았다(Branch 0%).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { connection } from 'next/server';

import { SchedulePanel } from '@widgets/MatchSchedule/ui';
import { MatchesTab } from '@features/matches/ui';
import { getSchedule } from '@features/matches/api';
import type { Match } from '@entities/matches/types';

vi.mock('next/server', () => ({
  connection: vi.fn(() => Promise.resolve()),
}));

vi.mock('@features/matches/api', () => ({
  getSchedule: vi.fn(),
}));

const getScheduleMock = vi.mocked(getSchedule);
const connectionMock = vi.mocked(connection);

const SEASON_LABEL = '2026-27';
const SEASON_START_YEAR = 2026;

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('SchedulePanel', () => {
  it('matches가 null이면 에러 StateBox를 렌더하고 connection()이 1회 호출된다 (실패 분기)', async () => {
    getScheduleMock.mockResolvedValue(null);

    render(
      await SchedulePanel({
        seasonLabel: SEASON_LABEL,
        seasonStartYear: SEASON_START_YEAR,
      })
    );

    expect(
      screen.getByText('경기 일정을 불러오지 못했어요')
    ).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument();

    // 조회 실패에서도 동적화(connection())는 이미 일어난다 — R2-6/D-10 회귀 게이트.
    expect(connectionMock).toHaveBeenCalledTimes(1);
  });

  it('matches가 있으면 MatchesTab에 season·matches를 그대로 배선한다 (성공 분기)', async () => {
    const matches: Match[] = [];
    getScheduleMock.mockResolvedValue(matches);

    const element = await SchedulePanel({
      seasonLabel: SEASON_LABEL,
      seasonStartYear: SEASON_START_YEAR,
    });

    expect(element.type).toBe(MatchesTab);
    expect(element.props).toEqual({
      season: SEASON_LABEL,
      matches,
    });
  });

  it('props로 받은 seasonStartYear로 getSchedule을 정확히 1회 호출한다', async () => {
    getScheduleMock.mockResolvedValue([]);

    await SchedulePanel({
      seasonLabel: SEASON_LABEL,
      seasonStartYear: SEASON_START_YEAR,
    });

    expect(getScheduleMock).toHaveBeenCalledTimes(1);
    expect(getScheduleMock).toHaveBeenCalledWith(SEASON_START_YEAR);
  });

  it('실패 분기의 StateBox는 에러 variant(role=alert)로 렌더된다', async () => {
    getScheduleMock.mockResolvedValue(null);

    render(
      await SchedulePanel({
        seasonLabel: SEASON_LABEL,
        seasonStartYear: SEASON_START_YEAR,
      })
    );

    const alertBox = screen.getByRole('alert');
    expect(alertBox).toHaveTextContent('경기 일정을 불러오지 못했어요');
  });
});
