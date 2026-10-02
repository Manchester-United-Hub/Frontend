/**
 * SummaryPanel 테스트 — S2-13. (StandingsPanel.test.tsx와 같은 주석 규약)
 * render(<SummaryPanel/>)는 하지 않는다. 컴포넌트 본문을 Node에서 실행(await)하고
 * 반환된 React element를 RTL로 렌더해 사용자에게 보이는 것을 단언한다(S2-13 3-a) —
 * 반환 트리(Shell > ul > SummaryCard*4)에 async 컴포넌트가 없다.
 *
 * toSeasonSummaryCards는 mock하지 않는다 — 실제 순수 함수를 오라클로 쓴다(레포 관행:
 * toSeasonSummaryCards.test.ts 상단 주석의 "변환 로직을 재작성해 중복 검증하지 않는다"와
 * 동일). 여기서는 그 함수의 출력이 패널을 거쳐 실제로 사용자에게 보이는지만 검증한다.
 *
 * F-27 범위 밖(문자상 `if(!data)` 분기가 없다)이지만 이번 라운드에 포함한다 — panels/
 * 3파일 중 2개만 테스트하고 1개를 남기면 이번 결함(F-26)을 만든 패턴(D-17)을 그대로
 * 재생산한다(decision-4 §2.4.0). SummaryPanel의 실패 흡수 경로(standings 실패 →
 * 플레이스홀더 4장, B-5/S2-7)는 지금까지 패널 수준에서 무검증이었다 — 이 파일이 최초의
 * 검증이다.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { SummaryPanel } from '@pages/season/ui/Panels';
import { getStandings } from '@features/rank/api';
import type { Standing } from '@entities/rank/types';

vi.mock('@features/rank/api', () => ({
  getStandings: vi.fn(),
}));

const getStandingsMock = vi.mocked(getStandings);

const SEASON_START_YEAR = 2026;

// R2-3 방어 원칙(decision-3 H2-1): 서로 다른 값을 넣어야 필드 스왑이 잡힌다.
const unitedStanding: Standing = {
  teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
  pos: 8,
  code: 'MUN',
  nm: '맨체스터 유나이티드',
  p: 29,
  w: 14,
  d: 5,
  l: 10,
  gf: 45,
  ga: 38,
  diff: 7,
  pts: 47,
  form: ['W', 'D', 'L', 'W', 'L'],
  mv: 'same',
  zone: '',
  utd: true,
};

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('SummaryPanel', () => {
  it('getStandings가 null이면 플레이스홀더 4장이 사용자에게 보인다 (실패 흡수 경로, B-5/S2-7)', async () => {
    getStandingsMock.mockResolvedValue(null);

    render(await SummaryPanel({ seasonStartYear: SEASON_START_YEAR }));

    expect(screen.getAllByText('—')).toHaveLength(4);
    expect(screen.getAllByText('정보 없음')).toHaveLength(4);
  });

  it('맨유 행이 있는 standings가 오면 카드에 실값이 반영된다', async () => {
    getStandingsMock.mockResolvedValue([unitedStanding]);

    render(await SummaryPanel({ seasonStartYear: SEASON_START_YEAR }));

    expect(screen.getByText('8위')).toBeInTheDocument();
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('props로 받은 seasonStartYear로 getStandings를 정확히 1회 호출한다', async () => {
    getStandingsMock.mockResolvedValue([unitedStanding]);

    await SummaryPanel({ seasonStartYear: SEASON_START_YEAR });

    expect(getStandingsMock).toHaveBeenCalledTimes(1);
    expect(getStandingsMock).toHaveBeenCalledWith(SEASON_START_YEAR);
  });
});
