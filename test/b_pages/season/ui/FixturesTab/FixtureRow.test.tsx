/**
 * FixtureRow 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: past 경기(스코어+결과배지) vs next/upcoming 경기(시간+카운트다운) 분기,
 * countdown 없는 upcoming 경기의 "예정" 폴백, utd 팀명 강조(font-bold), venue 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { FixtureRow } from '@pages/season/ui/FixturesTab/FixtureRow';
import { fixtures } from '@pages/season/model';

afterEach(cleanup);

describe('FixtureRow', () => {
  it('past 경기는 스코어와 결과 배지(role=img)를 렌더한다', () => {
    const pastFixture = fixtures.find((f) => f.status === 'past')!;
    render(<FixtureRow fixture={pastFixture} />);

    expect(screen.getByText(`${pastFixture.home.score}–${pastFixture.away.score}`)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('next 경기는 스코어 대신 시간과 카운트다운을 렌더하고 결과 배지가 없다', () => {
    const nextFixture = fixtures.find((f) => f.status === 'next')!;
    render(<FixtureRow fixture={nextFixture} />);

    expect(screen.getByText(nextFixture.time!)).toBeInTheDocument();
    expect(screen.getByText(nextFixture.countdown!)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('countdown이 없는 upcoming 경기는 "예정"으로 폴백한다', () => {
    const upcomingWithoutCountdown = fixtures.find(
      (f) => f.status === 'upcoming' && !f.countdown
    )!;
    render(<FixtureRow fixture={upcomingWithoutCountdown} />);
    expect(screen.getByText('예정')).toBeInTheDocument();
  });

  it('past 경기인데 스코어가 없으면 "undefined"가 아니라 구분자(–)로 폴백한다', () => {
    const base = fixtures.find((f) => f.status === 'past')!;
    const noScore = {
      ...base,
      home: { ...base.home, score: undefined },
      away: { ...base.away, score: undefined },
    };
    render(<FixtureRow fixture={noScore} />);

    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
    expect(screen.getByText('–')).toBeInTheDocument();
  });

  it('맨유 측(utd) 팀명은 굵게(font-bold) 렌더된다', () => {
    const fixture = fixtures.find((f) => f.status === 'past')!;
    render(<FixtureRow fixture={fixture} />);
    const utdSide = fixture.home.utd ? fixture.home : fixture.away;
    expect(screen.getByText(utdSide.nm)).toHaveClass('font-bold');
  });

  it('경기장(venue)을 렌더한다', () => {
    const fixture = fixtures[0];
    render(<FixtureRow fixture={fixture} />);
    expect(screen.getByText(fixture.venue)).toBeInTheDocument();
  });
});
