/**
 * convertMatchesDTO2DAO 단위 테스트.
 *
 * 검증 목적:
 * - ha 판정 3분기 — 맨유(teamId 33)가 홈/원정/미포함일 때
 * - 날짜 파생 필드(month·date·dow) 포맷
 * - 팀 한글명·팀 코드 매핑과 미매핑 팀 폴백
 * - score null → undefined 변환
 * - 고정 필드(comp·round·status·result)·venue 전달, 빈 배열 처리
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
  convertMatchesDTO2DAO([createMatchDTO(overrides)])[0];

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
        name: 'Sunderland',
        logo: 'https://example.com/sun.png',
        winner: false,
      },
    });

    expect(match.away.nm).toBe('Sunderland');
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

  it('comp·round·status·result를 고정값으로 채운다', () => {
    const match = convertOne();

    expect(match.comp).toBe('프리미어리그');
    expect(match.round).toBe('0R');
    expect(match.status).toBe('past');
    expect(match.result).toBe('D');
  });

  it('빈 배열을 넣으면 빈 배열을 반환한다', () => {
    expect(convertMatchesDTO2DAO([])).toEqual([]);
  });

  it('여러 경기를 입력 순서대로 변환한다', () => {
    const matches = convertMatchesDTO2DAO([
      createMatchDTO({ matchId: 1 }),
      createMatchDTO({ matchId: 2 }),
    ]);

    expect(matches).toHaveLength(2);
    expect(matches.map((match) => match.id)).toEqual(['1', '2']);
  });
});
