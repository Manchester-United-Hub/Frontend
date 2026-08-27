/**
 * MatchesTab 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * ST-08: MatchesTab이 `useMatchScheduleList`(react-query) 소비를 그만두고
 * `matches: Match[]`를 props로 직접 받는 순수 표현 컴포넌트로 바뀌었다
 * (S-6, src/b_pages/season/ui/MatchesTab/MatchTab.tsx). 기존
 * loading(MatchesSkeleton, role=status)/error(StateBox, role=alert) 2분기는
 * 컴포넌트에서 완전히 사라졌다 — loading은 SeasonTabs가 감싸는 Suspense
 * fallback으로, error는 SchedulePanel(서버 컴포넌트)의 실패 분기(StateBox)로
 * 이관됐다. 두 곳 모두 async 서버 컴포넌트/서버 조립 지점이라 jsdom에서
 * RTL로 렌더할 수 없어(S-16) 이 파일에서는 검증하지 않는다 — Suspense
 * fallback은 순수 마크업이라 단위 테스트 가치가 낮고, SchedulePanel의
 * 데이터 조회+실패 분기는 ST-09가 `getSchedule` 데이터 접근 함수 테스트로
 * 커버한다.
 *
 * `getMatchScheduleList` vi.mock·QueryClientProvider 래퍼는 더는 필요
 * 없어 제거했다. `matches` fixture는 SeasonTabs.test.tsx와 동일하게 공유
 * `../../model/mockData`를 사용해 중복 fixture를 없앴다 — 기존 파일이
 * inline fixture를 유지했던 사유("병렬 작업 당시 파일 경계 독립성",
 * decisions.md D-11 정리 부채)는 react-query mock이 사라지며 함께
 * 소멸했다.
 *
 * 검증 목적:
 * - 성공(matches 있음) 렌더 시 PanelHead·필터 그룹·전체 행이 렌더된다
 * - 성공 + 빈 배열이면 빈 상태 문구가 렌더된다(isEmpty 분기)
 * - 홈/원정/전체 필터 상호작용은 절대 축소하지 않는다(R-8, has_user_input
 *   근거). 행 개수만 비교하면 조립 실수(엉뚱한 데이터 연결)가 우연히
 *   개수는 맞아도 내용이 틀린 채 통과할 수 있으므로, 필터 적용 후
 *   실제로 화면에 남아있는/사라진 상대팀 이름까지 확인해 강화했다.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { MatchesTab } from '@features/matches/ui';
import type { Match } from '@entities/matches/types';
import { matches } from '@test/fixtures/matches';

const season = '2026-27';

const rowCount = () => screen.getAllByRole('listitem').length;

/** 상대팀 이름 — home.utd가 true면 United가 홈팀이므로 상대는 away, 아니면 home. */
const opponentName = (match: Match) =>
  match.home.utd ? match.away.nm : match.home.nm;

afterEach(cleanup);

describe('MatchesTab', () => {
  it('성공 + 데이터면 PanelHead·필터 그룹·전체 행이 렌더된다', () => {
    render(<MatchesTab season={season} matches={matches} />);

    expect(
      screen.getByRole('heading', { level: 2, name: '일정 & 결과' })
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '홈/원정' })).toBeInTheDocument();
    expect(rowCount()).toBe(matches.length);
  });

  it('성공 + 빈 배열이면 빈 상태 문구가 렌더된다', () => {
    render(<MatchesTab season={season} matches={[]} />);

    expect(
      screen.getByRole('heading', { name: '조건에 맞는 경기가 없어요' })
    ).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('홈 필터 적용 시 원정 전용 상대팀이 사라지고 홈 상대팀만 남는다', async () => {
    const user = userEvent.setup();
    render(<MatchesTab season={season} matches={matches} />);

    expect(rowCount()).toBe(matches.length);

    await user.click(screen.getByRole('button', { name: '홈' }));

    const homeMatches = matches.filter((match) => match.ha === 'home');
    const awayMatches = matches.filter((match) => match.ha === 'away');
    expect(rowCount()).toBe(homeMatches.length);
    homeMatches.forEach((match) => {
      expect(screen.getByText(opponentName(match))).toBeInTheDocument();
    });
    awayMatches.forEach((match) => {
      expect(screen.queryByText(opponentName(match))).not.toBeInTheDocument();
    });
  });

  it('원정 필터 적용 시 홈 전용 상대팀이 사라지고 원정 상대팀만 남는다', async () => {
    const user = userEvent.setup();
    render(<MatchesTab season={season} matches={matches} />);

    await user.click(screen.getByRole('button', { name: '원정' }));

    const homeMatches = matches.filter((match) => match.ha === 'home');
    const awayMatches = matches.filter((match) => match.ha === 'away');
    expect(rowCount()).toBe(awayMatches.length);
    awayMatches.forEach((match) => {
      expect(screen.getByText(opponentName(match))).toBeInTheDocument();
    });
    homeMatches.forEach((match) => {
      expect(screen.queryByText(opponentName(match))).not.toBeInTheDocument();
    });
  });

  it('전체 필터로 되돌리면 필터로 숨었던 경기가 다시 보인다', async () => {
    const user = userEvent.setup();
    render(<MatchesTab season={season} matches={matches} />);

    await user.click(screen.getByRole('button', { name: '홈' }));
    expect(rowCount()).toBe(
      matches.filter((match) => match.ha === 'home').length
    );

    await user.click(screen.getByRole('button', { name: '전체' }));

    expect(rowCount()).toBe(matches.length);
    matches.forEach((match) => {
      expect(screen.getByText(opponentName(match))).toBeInTheDocument();
    });
  });
});
