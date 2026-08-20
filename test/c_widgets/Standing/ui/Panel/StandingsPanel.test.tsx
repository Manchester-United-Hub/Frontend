/**
 * StandingsPanel 테스트 — async 서버 컴포넌트를 함수로 직접 호출해 검증한다(S2-13).
 * render(<StandingsPanel/>)는 하지 않는다. 컴포넌트 본문을 Node에서 실행(await)하고
 * 반환된 React element를 검사한다. 실패 분기의 반환 트리(Shell > StateBox)에는 async
 * 컴포넌트가 없으므로 RTL로 렌더해 사용자에게 보이는 것을 그대로 단언한다(S2-13 3-a).
 * 성공 분기는 자식(StandingsTab)이 자기 테스트로 이미 덮여 있으므로 element.type과
 * props 배선만 단언한다(S2-13 3-b) — 같은 렌더를 두 번 검증하지 않는다.
 *
 * F-27: 이 분기는 이 파일이 생기기 전까지 성공·실패 어느 쪽도 실행되지 않았다(Branch 0%).
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { StandingsPanel } from '@widgets/Standing/ui/Panel';
import { StandingsTab } from '@widgets/Standing/ui/StandingsTab';
import { getStandings } from '@features/rank/api';
import type { Standing } from '@entities/rank/types';

vi.mock('@features/rank/api', () => ({
  getStandings: vi.fn(),
}));

const getStandingsMock = vi.mocked(getStandings);

const SEASON_LABEL = '2026-27';
const SEASON_START_YEAR = 2026;

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('StandingsPanel', () => {
  it('standings가 null이면 에러 StateBox를 렌더한다 (실패 분기)', async () => {
    getStandingsMock.mockResolvedValue(null);

    render(
      await StandingsPanel({
        seasonLabel: SEASON_LABEL,
        seasonStartYear: SEASON_START_YEAR,
      })
    );

    expect(
      screen.getByText('시즌 순위표를 불러오지 못했어요')
    ).toBeInTheDocument();
    expect(screen.getByText('잠시 후 다시 시도해주세요.')).toBeInTheDocument();
  });

  it('standings가 있으면 StandingsTab에 season·standings를 그대로 배선한다 (성공 분기)', async () => {
    const standings: Standing[] = [];
    getStandingsMock.mockResolvedValue(standings);

    const element = await StandingsPanel({
      seasonLabel: SEASON_LABEL,
      seasonStartYear: SEASON_START_YEAR,
    });

    expect(element.type).toBe(StandingsTab);
    expect(element.props).toEqual({
      season: SEASON_LABEL,
      standings,
    });
  });

  it('props로 받은 seasonStartYear로 getStandings를 정확히 1회 호출한다', async () => {
    getStandingsMock.mockResolvedValue([]);

    await StandingsPanel({
      seasonLabel: SEASON_LABEL,
      seasonStartYear: SEASON_START_YEAR,
    });

    expect(getStandingsMock).toHaveBeenCalledTimes(1);
    expect(getStandingsMock).toHaveBeenCalledWith(SEASON_START_YEAR);
  });

  it('실패 분기의 StateBox는 에러 variant(role=alert)로 렌더된다', async () => {
    getStandingsMock.mockResolvedValue(null);

    render(
      await StandingsPanel({
        seasonLabel: SEASON_LABEL,
        seasonStartYear: SEASON_START_YEAR,
      })
    );

    // StateBox 실제 구현(src/f_shared/ui/StateBox/StateBox.tsx)의 접근성 계약:
    // variant==='error'일 때만 role="alert"를 부여한다. 클래스 문자열 단언은 하지
    // 않는다(리팩토링에 깨지고 사용자 관점이 아니다).
    const alertBox = screen.getByRole('alert');
    expect(alertBox).toHaveTextContent('시즌 순위표를 불러오지 못했어요');
  });
});
