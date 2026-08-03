/**
 * MatchRow 전용 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 검증 목적: past 경기(스코어+결과배지) vs next/upcoming 경기(시간+카운트다운) 분기,
 * countdown 없는 upcoming 경기의 "예정" 폴백, utd 팀명 강조(font-bold), venue 렌더.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { MatchRow } from '@pages/season/ui/MatchesTab/MatchRow';
import type { Match } from '@entities/matches/model';

afterEach(cleanup);

const matches: Match[] = [
  {
    id: 'p1',
    month: 'M1',
    date: '3/1',
    dow: '토',
    comp: '프리미어리그',
    round: '27R',
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
    id: 'n1',
    month: 'M2',
    date: '4/12',
    dow: '토',
    comp: '프리미어리그',
    round: '32R',
    ha: 'home',
    home: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'MUN',
      nm: '맨체스터 유나이티드',
      utd: true,
    },
    away: {
      teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
      code: 'LIV',
      nm: '리버풀',
    },
    status: 'next',
    time: '20:00',
    countdown: 'D-3',
    venue: '올드 트래포드',
    kickoff: '2025-04-12T20:00',
  },
  {
    id: 'u1',
    month: 'M3',
    date: '5/31',
    dow: '토',
    comp: 'FA컵',
    round: '결승',
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

describe('MatchRow', () => {
  it('past 경기는 스코어와 결과 배지(role=img)를 렌더한다', () => {
    const pastMatch = matches.find((f) => f.status === 'past')!;
    render(<MatchRow match={pastMatch} />);

    expect(
      screen.getByText(`${pastMatch.home.score}–${pastMatch.away.score}`)
    ).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('next 경기는 스코어 대신 시간과 카운트다운을 렌더하고 결과 배지가 없다', () => {
    const nextMatch = matches.find((f) => f.status === 'next')!;
    render(<MatchRow match={nextMatch} />);

    expect(screen.getByText(nextMatch.time!)).toBeInTheDocument();
    expect(screen.getByText(nextMatch.countdown!)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('countdown이 없는 upcoming 경기는 "예정"으로 폴백한다', () => {
    const upcomingWithoutCountdown = matches.find(
      (f) => f.status === 'upcoming' && !f.countdown
    )!;
    render(<MatchRow match={upcomingWithoutCountdown} />);
    expect(screen.getByText('예정')).toBeInTheDocument();
  });

  it('past 경기인데 스코어가 없으면 "undefined"가 아니라 구분자(–)로 폴백한다', () => {
    const base = matches.find((f) => f.status === 'past')!;
    const noScore = {
      ...base,
      home: { ...base.home, score: undefined },
      away: { ...base.away, score: undefined },
    };
    render(<MatchRow match={noScore} />);

    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument();
    expect(screen.getByText('–')).toBeInTheDocument();
  });

  it('past 경기인데 result가 없으면 결과 배지를 렌더하지 않는다', () => {
    const base = matches.find((f) => f.status === 'past')!;
    render(<MatchRow match={{ ...base, result: undefined }} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('맨유 측(utd) 팀명은 굵게(font-bold) 렌더된다', () => {
    const Match = matches.find((f) => f.status === 'past')!;
    render(<MatchRow match={Match} />);
    const utdSide = Match.home.utd ? Match.home : Match.away;
    expect(screen.getByText(utdSide.nm)).toHaveClass('font-bold');
  });

  it('경기장(venue)을 렌더한다', () => {
    const Match = matches[0];
    render(<MatchRow match={Match} />);
    expect(screen.getByText(Match.venue)).toBeInTheDocument();
  });
});
