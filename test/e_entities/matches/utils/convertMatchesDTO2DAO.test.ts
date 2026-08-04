/**
 * convertMatchesDTO2DAO 단위 테스트.
 *
 * 검증 목적:
 * - ha 판정 3분기 — 맨유(teamId 33)가 홈/원정/미포함일 때
 * - 날짜 파생 필드(month·date·dow) 포맷
 * - 팀 한글명·팀 코드 매핑과 미매핑 팀 폴백
 * - score null → undefined 변환
 * - 고정 필드(comp·round)·status placeholder·result 계산(스코어·ha 기준)·utd·time·kickoff·venue 전달, 빈 배열 처리
 */

import { describe, it, expect } from 'vitest';

import { convertMatchesDTO2DAO } from '@entities/matches/utils';
import type { MatchScheduleDTO } from '@entities/matches/model';

const MANCHESTER_UNITED_TEAM_ID = 33;
const EVERTON_TEAM_ID = 45;
const ARSENAL_TEAM_ID = 42;

const createMatchDTO = (
  overrides: Partial<MatchScheduleDTO> = {}
): MatchScheduleDTO => ({
  matchId: 1001,
  date: '2025-05-11T20:00',
  venue: { name: '올드 트래포드', city: 'Manchester' },
  homeTeam: {
    teamId: MANCHESTER_UNITED_TEAM_ID,
    name: 'Manchester United',
    logo: 'https://example.com/mun.png',
    winner: true,
  },
  awayTeam: {
    teamId: EVERTON_TEAM_ID,
    name: 'Everton',
    logo: 'https://example.com/eve.png',
    winner: false,
  },
  score: { home: 2, away: 1 },
  ...overrides,
});

const convertOne = (overrides: Partial<MatchScheduleDTO> = {}) =>
  convertMatchesDTO2DAO({
    pastMatches: [createMatchDTO(overrides)],
    upcomingMatches: [],
  })[0];

describe('convertMatchesDTO2DAO — ha 판정', () => {
  it('맨유가 홈팀이면 ha가 home이다', () => {
    expect(convertOne().ha).toBe('home');
  });

  it('맨유가 원정팀이면 ha가 away이다', () => {
    const match = convertOne({
      homeTeam: {
        teamId: EVERTON_TEAM_ID,
        name: 'Everton',
        logo: 'https://example.com/eve.png',
        winner: false,
      },
      awayTeam: {
        teamId: MANCHESTER_UNITED_TEAM_ID,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: true,
      },
    });

    expect(match.ha).toBe('away');
  });

  it('양팀 모두 맨유가 아니면 ha가 neutral이다', () => {
    const match = convertOne({
      homeTeam: {
        teamId: ARSENAL_TEAM_ID,
        name: 'Arsenal',
        logo: 'https://example.com/ars.png',
        winner: false,
      },
      awayTeam: {
        teamId: EVERTON_TEAM_ID,
        name: 'Everton',
        logo: 'https://example.com/eve.png',
        winner: true,
      },
    });

    expect(match.ha).toBe('neutral');
  });
});

describe('convertMatchesDTO2DAO — 날짜 파생 필드', () => {
  it('month를 "YYYY년 M월" 형식으로 만든다', () => {
    expect(convertOne({ date: '2025-05-11T20:00' }).month).toBe('2025년 5월');
  });

  it('date를 "M/D" 형식으로 만든다', () => {
    expect(convertOne({ date: '2025-05-11T20:00' }).date).toBe('5/11');
  });

  it('dow를 한글 요일로 만든다', () => {
    // 2025-05-11은 일요일
    expect(convertOne({ date: '2025-05-11T20:00' }).dow).toBe('일');
  });

  it('1월 경기의 month·date에 0을 덧붙이지 않는다', () => {
    const match = convertOne({ date: '2026-01-03T15:00' });

    expect(match.month).toBe('2026년 1월');
    expect(match.date).toBe('1/3');
    // 2026-01-03은 토요일
    expect(match.dow).toBe('토');
  });
});

describe('convertMatchesDTO2DAO — 팀 정보 매핑', () => {
  it('matchId를 문자열 id로 변환한다', () => {
    expect(convertOne({ matchId: 2024 }).id).toBe('2024');
  });

  it('사전에 있는 팀명을 한글명으로 바꾼다', () => {
    const match = convertOne();

    expect(match.home.nm).toBe('맨체스터 유나이티드');
    expect(match.away.nm).toBe('에버턴');
  });

  it('사전에 없는 팀명은 원본 이름을 그대로 쓴다', () => {
    const match = convertOne({
      awayTeam: {
        teamId: 99,
        name: 'Burnley',
        logo: 'https://example.com/bur.png',
        winner: false,
      },
    });

    expect(match.away.nm).toBe('Burnley');
  });

  it('API-Sports 팀명("FC" 접미 없음)을 팀 코드로 바꾼다', () => {
    const match = convertOne({
      homeTeam: {
        teamId: MANCHESTER_UNITED_TEAM_ID,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: true,
      },
      awayTeam: {
        teamId: EVERTON_TEAM_ID,
        name: 'Everton',
        logo: 'https://example.com/eve.png',
        winner: false,
      },
    });

    expect(match.home.code).toBe('MUN');
    expect(match.away.code).toBe('EVE');
  });

  it('팀 로고 URL을 그대로 전달한다', () => {
    const match = convertOne();

    expect(match.home.teamLogoUrl).toBe('https://example.com/mun.png');
    expect(match.away.teamLogoUrl).toBe('https://example.com/eve.png');
  });
});

describe('convertMatchesDTO2DAO — 스코어', () => {
  it('스코어가 있으면 숫자를 그대로 유지한다', () => {
    const match = convertOne({ score: { home: 2, away: 1 } });

    expect(match.home.score).toBe(2);
    expect(match.away.score).toBe(1);
  });

  it('스코어가 null이면 undefined로 바꾼다', () => {
    const match = convertOne({ score: { home: null, away: null } });

    expect(match.home.score).toBeUndefined();
    expect(match.away.score).toBeUndefined();
  });

  it('스코어 0은 undefined로 바꾸지 않는다', () => {
    const match = convertOne({ score: { home: 0, away: 0 } });

    expect(match.home.score).toBe(0);
    expect(match.away.score).toBe(0);
  });
});

describe('convertMatchesDTO2DAO — 그 외 필드·목록', () => {
  it('venue 이름을 전달한다', () => {
    expect(convertOne().venue).toBe('올드 트래포드');
  });

  it('빈 배열을 넣으면 빈 배열을 반환한다', () => {
    expect(
      convertMatchesDTO2DAO({ pastMatches: [], upcomingMatches: [] })
    ).toEqual([]);
  });

  it('여러 경기를 시간 순서대로 배열한다.', () => {
    const matches = convertMatchesDTO2DAO({
      pastMatches: [
        createMatchDTO({ date: '2026-08-02T00:00:00' }),
        createMatchDTO({ date: '2026-12-03T00:00:00' }),
      ],
      upcomingMatches: [
        createMatchDTO({ date: '2027-02-03T00:00:02' }),
        createMatchDTO({ date: '2027-02-03T00:00:01' }),
      ],
    });

    expect(matches).toHaveLength(4);
    expect(matches.map((match) => match.kickoff)).toEqual([
      '2026-08-02T00:00:00',
      '2026-12-03T00:00:00',
      '2027-02-03T00:00:01',
      '2027-02-03T00:00:02',
    ]);
  });
});

describe('convertMatchesDTO2DAO — time', () => {
  it('date의 시:분을 HH:mm 형식으로 채운다', () => {
    expect(convertOne({ date: '2025-05-11T20:05' }).time).toBe('20:05');
  });

  it('한 자리 시·분에 0을 채운다', () => {
    expect(convertOne({ date: '2025-05-11T09:07' }).time).toBe('09:07');
  });
});

describe('convertMatchesDTO2DAO — kickoff', () => {
  it('date 원본을 그대로 kickoff에 전달한다', () => {
    expect(convertOne({ date: '2025-05-11T20:00' }).kickoff).toBe(
      '2025-05-11T20:00'
    );
  });
});

describe('convertMatchesDTO2DAO — utd', () => {
  it('맨유가 홈팀이면 home.utd가 true, away.utd가 false다', () => {
    const match = convertOne();

    expect(match.home.utd).toBe(true);
    expect(match.away.utd).toBe(false);
  });

  it('맨유가 원정팀이면 away.utd가 true, home.utd가 false다', () => {
    const match = convertOne({
      homeTeam: {
        teamId: EVERTON_TEAM_ID,
        name: 'Everton',
        logo: 'https://example.com/eve.png',
        winner: false,
      },
      awayTeam: {
        teamId: MANCHESTER_UNITED_TEAM_ID,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: true,
      },
    });

    expect(match.home.utd).toBe(false);
    expect(match.away.utd).toBe(true);
  });
});

describe('convertMatchesDTO2DAO — result(맨유 관점, 스코어 확정 + non-neutral일 때만)', () => {
  it('맨유(홈)가 이기면 W다', () => {
    const match = convertOne({ score: { home: 2, away: 1 } });

    expect(match.ha).toBe('home');
    expect(match.result).toBe('W');
  });

  it('맨유(원정)가 이기면 W다', () => {
    const match = convertOne({
      homeTeam: {
        teamId: EVERTON_TEAM_ID,
        name: 'Everton',
        logo: 'https://example.com/eve.png',
        winner: false,
      },
      awayTeam: {
        teamId: MANCHESTER_UNITED_TEAM_ID,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: true,
      },
      score: { home: 0, away: 3 },
    });

    expect(match.ha).toBe('away');
    expect(match.result).toBe('W');
  });

  it('맨유가 지면 L이다', () => {
    const match = convertOne({ score: { home: 0, away: 1 } });

    expect(match.result).toBe('L');
  });

  it('스코어가 같으면 D다', () => {
    const match = convertOne({ score: { home: 1, away: 1 } });

    expect(match.result).toBe('D');
  });

  it('neutral(맨유 미참여) 경기는 스코어가 확정돼도 result가 undefined다', () => {
    const match = convertOne({
      homeTeam: {
        teamId: ARSENAL_TEAM_ID,
        name: 'Arsenal',
        logo: 'https://example.com/ars.png',
        winner: false,
      },
      awayTeam: {
        teamId: EVERTON_TEAM_ID,
        name: 'Everton',
        logo: 'https://example.com/eve.png',
        winner: true,
      },
      score: { home: 1, away: 2 },
    });

    expect(match.ha).toBe('neutral');
    expect(match.result).toBeUndefined();
  });

  it('스코어가 미확정(양쪽 null)이면 result가 undefined다', () => {
    const match = convertOne({ score: { home: null, away: null } });

    expect(match.result).toBeUndefined();
  });

  it('스코어가 한쪽만 확정이어도 result가 undefined다', () => {
    const match = convertOne({ score: { home: 2, away: null } });

    expect(match.result).toBeUndefined();
  });
});
