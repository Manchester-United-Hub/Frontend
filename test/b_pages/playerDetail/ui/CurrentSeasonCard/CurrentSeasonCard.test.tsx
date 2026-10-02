/**
 * CurrentSeasonCard 단위 테스트 — QA 검증(qa-playerDetail, 이슈 #28).
 *
 * SeasonStatBar(내부 서브컴포넌트)도 이 파일에서 함께 검증한다.
 *
 * 필수 시나리오(plan.json verification.qa_guidance #1): 필드플레이어 vs GK —
 * CurrentSeasonCard 도넛↔링, 바 분기(GK Shield 노트).
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { CurrentSeasonCard } from '@pages/playerDetail/ui';

afterEach(cleanup);

const FIELD_PLAYER_SNAPSHOT = {
  szn: '2025/26',
  title: '현재 시즌',
  apps: 30,
  goals: 12,
  assists: 8,
};

const GK_SNAPSHOT = {
  szn: '2025/26',
  title: '현재 시즌',
  apps: 34,
  goals: 0,
  assists: 0,
};

describe('CurrentSeasonCard — 필드플레이어(Donut) vs GK(Ring) 분기', () => {
  it('필드플레이어(isGoalkeeper=false)는 Donut(공격 포인트)을 렌더하고 Ring은 렌더하지 않는다', () => {
    render(<CurrentSeasonCard snapshot={FIELD_PLAYER_SNAPSHOT} isGoalkeeper={false} />);
    expect(screen.getByRole('img', { name: /공격 포인트/ })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /^출전/ })).not.toBeInTheDocument();
    // 득점·도움 바가 모두 렌더된다
    expect(screen.getByText('득점')).toBeInTheDocument();
    expect(screen.getByText('도움')).toBeInTheDocument();
    // GK 노트 문구는 렌더되지 않는다
    expect(screen.queryByText(/골키퍼는 출전 중심/)).not.toBeInTheDocument();
  });

  it('GK(isGoalkeeper=true)는 Ring(출전)을 렌더하고 Donut은 렌더하지 않으며 Shield 노트 문구를 보여준다', () => {
    render(<CurrentSeasonCard snapshot={GK_SNAPSHOT} isGoalkeeper />);
    expect(screen.getByRole('img', { name: /출전 34/ })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: /공격 포인트/ })).not.toBeInTheDocument();
    expect(screen.getByText(/골키퍼는 출전 중심으로 표시됩니다\./)).toBeInTheDocument();
    // 득점·도움 바는 GK 분기에서 렌더되지 않는다(노트 문구로 대체)
    expect(screen.queryByText('득점')).not.toBeInTheDocument();
    expect(screen.queryByText('도움')).not.toBeInTheDocument();
  });

  it('은퇴 선수는 title="마지막 시즌"을 그대로 표시한다(스냅샷 props 전달만 검증)', () => {
    render(
      <CurrentSeasonCard
        snapshot={{ szn: '2016/17', title: '마지막 시즌', apps: 25, goals: 25, assists: 8 }}
        isGoalkeeper={false}
      />
    );
    expect(screen.getByText('마지막 시즌')).toBeInTheDocument();
    expect(screen.getByText(/2016\/17/)).toBeInTheDocument();
  });
});

describe('CurrentSeasonCard — 출전 경기 바(SeasonStatBar)', () => {
  it('출전 경기 값/최대치(38경기)를 항상 렌더한다', () => {
    render(<CurrentSeasonCard snapshot={FIELD_PLAYER_SNAPSHOT} isGoalkeeper={false} />);
    expect(screen.getByText('출전 경기')).toBeInTheDocument();
    expect(screen.getByText('/ 38경기')).toBeInTheDocument();
  });
});
