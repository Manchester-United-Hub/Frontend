/**
 * pickLandingMatches 단위 테스트.
 *
 * 검증 목적:
 * - recent = status가 past인 항목 중 kickoff이 가장 늦은 것
 * - next = status가 'next' | 'upcoming' 전체 중 kickoff이 가장 이른 것 (High-2 재작업, D-11)
 * - 정렬 순서에 의존하지 않고 kickoff으로 직접 판정하는지
 * - 원본 배열을 변형하지 않는지 (.toSorted() 사용)
 * - recent·next 어느 쪽도 없으면 null을 반환하고 예외를 던지지 않는지
 * - T-1/T-2(High-2 재작업, D-11): 상류 순서(배열 인덱스 0의 'next' 플래그) ≠ kickoff 순서일 때
 *   kickoff으로 직접 판정하는지, kickoff 동률이면 'next' 플래그가 tie-break로만 쓰이는지
 */

import { describe, it, expect } from 'vitest';

import { pickLandingMatches } from '@entities/matches/utils';
import type { Match } from '@entities/matches/types';
import { matches } from '@test/fixtures/matches';

const pastMatches = matches.filter((match) => match.status === 'past');
const upcomingMatch = matches.find((match) => match.status === 'upcoming');

const NEXT_MATCH: Match = {
  id: 'next-1',
  month: 'M2',
  date: '4/12',
  dow: '토',
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
  venue: '올드 트래포드',
  kickoff: '2025-04-12T16:30',
  countdown: 'D-7',
};

const UPCOMING_LATE: Match = {
  id: 'upcoming-late',
  month: 'M3',
  date: '6/14',
  dow: '토',
  ha: 'away',
  home: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'CHE',
    nm: '첼시',
  },
  away: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    utd: true,
  },
  status: 'upcoming',
  venue: '스탬포드 브릿지',
  kickoff: '2025-06-14T18:00',
};

const UPCOMING_EARLY: Match = {
  id: 'upcoming-early',
  month: 'M3',
  date: '6/7',
  dow: '토',
  ha: 'home',
  home: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    utd: true,
  },
  away: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'TOT',
    nm: '토트넘',
  },
  status: 'upcoming',
  venue: '올드 트래포드',
  kickoff: '2025-06-07T17:30',
};

/** idx0(상류 배열 첫 항목)에 'next' 플래그가 붙지만 kickoff은 더 늦다(오배선 재현용). */
const NEXT_MATCH_LATE: Match = {
  id: 'next-late',
  month: 'M4',
  date: '7/1',
  dow: '화',
  ha: 'home',
  home: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    utd: true,
  },
  away: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'ARS',
    nm: '아스널',
  },
  status: 'next',
  venue: '올드 트래포드',
  kickoff: '2025-07-01T15:00',
};

/** 'upcoming' 플래그뿐이지만 kickoff은 NEXT_MATCH_LATE보다 이르다. */
const UPCOMING_EARLIER_THAN_NEXT: Match = {
  id: 'upcoming-earlier-than-next',
  month: 'M3',
  date: '6/1',
  dow: '일',
  ha: 'away',
  home: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'CHE',
    nm: '첼시',
  },
  away: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    utd: true,
  },
  status: 'upcoming',
  venue: '스탬포드 브릿지',
  kickoff: '2025-06-01T15:00',
};

const TIE_KICKOFF = '2025-05-01T15:00';

const NEXT_MATCH_TIE: Match = {
  id: 'next-tie',
  month: 'M3',
  date: '5/1',
  dow: '목',
  ha: 'home',
  home: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    utd: true,
  },
  away: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'TOT',
    nm: '토트넘',
  },
  status: 'next',
  venue: '올드 트래포드',
  kickoff: TIE_KICKOFF,
};

const UPCOMING_MATCH_TIE: Match = {
  id: 'upcoming-tie',
  month: 'M3',
  date: '5/1',
  dow: '목',
  ha: 'away',
  home: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'WHU',
    nm: '웨스트햄',
  },
  away: {
    teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
    code: 'MUN',
    nm: '맨체스터 유나이티드',
    utd: true,
  },
  status: 'upcoming',
  venue: '런던 스타디움',
  kickoff: TIE_KICKOFF,
};

describe('pickLandingMatches', () => {
  it('정상 — recent는 kickoff이 가장 늦은 past, next는 status가 next인 항목을 반환한다', () => {
    const input = [...matches, NEXT_MATCH];

    const result = pickLandingMatches(input);

    expect(result.recent?.id).toBe('f4');
    expect(result.next).toBe(NEXT_MATCH);
  });

  it('past만 존재 — recent는 가장 늦은 past, next는 null이다', () => {
    const result = pickLandingMatches(pastMatches);

    expect(result.recent?.id).toBe('f4');
    expect(result.next).toBeNull();
  });

  it('upcoming만 존재 — recent는 null, next는 해당 upcoming 항목이다', () => {
    expect(upcomingMatch).toBeDefined();

    const result = pickLandingMatches(upcomingMatch ? [upcomingMatch] : []);

    expect(result.recent).toBeNull();
    expect(result.next?.id).toBe(upcomingMatch?.id);
  });

  it('빈 배열 — recent·next 모두 null이고 예외를 던지지 않는다', () => {
    expect(() => pickLandingMatches([])).not.toThrow();
    expect(pickLandingMatches([])).toEqual({ recent: null, next: null });
  });

  it('next 없이 upcoming만 여러 건 있는 경우 — kickoff이 가장 이른 upcoming을 next로 선택한다', () => {
    const input = [...pastMatches, UPCOMING_LATE, UPCOMING_EARLY];

    const result = pickLandingMatches(input);

    expect(result.recent?.id).toBe('f4');
    expect(result.next?.id).toBe('upcoming-early');
  });

  it('원본 배열을 변형하지 않는다', () => {
    const input = [...matches, NEXT_MATCH];
    const snapshot = [...input];

    pickLandingMatches(input);

    expect(input).toEqual(snapshot);
  });

  /* ── T-1/T-2: 상류 순서 ≠ kickoff 순서 (High-2 재작업, D-11) ──────────── */

  it('T-1 — idx0의 next 플래그가 더 늦은 kickoff이어도, 더 이른 upcoming이 next로 선택된다', () => {
    const input = [...pastMatches, NEXT_MATCH_LATE, UPCOMING_EARLIER_THAN_NEXT];

    const result = pickLandingMatches(input);

    expect(result.next?.id).toBe('upcoming-earlier-than-next');
  });

  it('T-2 — kickoff이 동률이면 status가 next인 항목이 tie-break로 선택된다', () => {
    const input = [...pastMatches, UPCOMING_MATCH_TIE, NEXT_MATCH_TIE];

    const result = pickLandingMatches(input);

    expect(result.next?.id).toBe('next-tie');
  });
});
