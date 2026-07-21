import { describe, it, expect } from 'vitest';
import {
  API_PATH,
  BFF_PATH,
  FETCH_TIMEOUT_MICROSECOND,
} from '@shared/api/configs';

describe('API_PATH', () => {
  it('newsList()는 /api/news를 반환한다', () => {
    expect(API_PATH.newsList()).toBe('/api/news');
  });
  it('recentNews()는 /api/news/recent를 반환한다', () => {
    expect(API_PATH.recentNews()).toBe('/api/news/recent');
  });
  it('teamStatistics()는 /api/team/statistics를 반환한다', () => {
    expect(API_PATH.teamStatistics()).toBe('/api/team/statistics');
  });
  it('team(teamId)는 /api/teams/:teamId를 반환한다', () => {
    expect(API_PATH.team(1)).toBe('/api/teams/1');
  });
  it('playerList()는 /api/players를 반환한다', () => {
    expect(API_PATH.playerList()).toBe('/api/players');
  });
  it('matchSchedule()는 /api/matches를 반환한다', () => {
    expect(API_PATH.matchSchedule()).toBe('/api/matches');
  });
  it('pastMatchDetail(matchId)는 /api/matches/:matchId/detail을 반환한다', () => {
    expect(API_PATH.pastMatchDetail(42)).toBe('/api/matches/42/detail');
  });
  it('liveMatchLineup(matchId)는 /api/matches/:matchId/lineups를 반환한다', () => {
    expect(API_PATH.liveMatchLineup(42)).toBe('/api/matches/42/lineups');
  });
});

describe('FETCH_TIMEOUT_MICROSECOND', () => {
  it('5000ms이다', () => {
    expect(FETCH_TIMEOUT_MICROSECOND).toBe(5000);
  });
});

describe('BFF_PATH', () => {
  it('matchSchedule()는 /api/v1/match/schedule를 반환한다', () => {
    expect(BFF_PATH.matchSchedule()).toBe('/api/v1/match/schedule');
  });

  it('liveMatchLineup(matchId)는 number를 받아 /api/v1/match/:matchId/lineups를 반환한다', () => {
    expect(BFF_PATH.liveMatchLineup(12345)).toBe('/api/v1/match/12345/lineups');
  });

  it('liveMatchLineup(matchId)는 string을 받아 /api/v1/match/:matchId/lineups를 반환한다', () => {
    expect(BFF_PATH.liveMatchLineup('12345')).toBe(
      '/api/v1/match/12345/lineups'
    );
  });

  it('pastMatchLineup(matchId)는 number를 받아 /api/v1/match/:matchId/detail을 반환한다', () => {
    expect(BFF_PATH.pastMatchLineup(42)).toBe('/api/v1/match/42/detail');
  });

  it('pastMatchLineup(matchId)는 string을 받아 /api/v1/match/:matchId/detail을 반환한다', () => {
    expect(BFF_PATH.pastMatchLineup('42')).toBe('/api/v1/match/42/detail');
  });

  it('newsList()는 /api/v1/news를 반환한다', () => {
    expect(BFF_PATH.newsList()).toBe('/api/v1/news');
  });

  it('playerList()는 /api/v1/player를 반환한다', () => {
    expect(BFF_PATH.playerList()).toBe('/api/v1/player');
  });

  it('teamInfo(teamId)는 number를 받아 /api/v1/team/:teamId를 반환한다', () => {
    expect(BFF_PATH.teamInfo(33)).toBe('/api/v1/team/33');
  });

  it('teamInfo(teamId)는 string을 받아 /api/v1/team/:teamId를 반환한다', () => {
    expect(BFF_PATH.teamInfo('33')).toBe('/api/v1/team/33');
  });

  it('teamStatistics()는 /api/v1/team/statistics를 반환한다', () => {
    expect(BFF_PATH.teamStatistics()).toBe('/api/v1/team/statistics');
  });
});
