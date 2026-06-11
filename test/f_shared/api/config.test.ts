import { describe, it, expect } from 'vitest';
import { API_PATH, FETCH_TIMEOUT_MICROSECOND } from '@shared/api/configs';

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
  it('gameSchedule()는 /api/fixtures를 반환한다', () => {
    expect(API_PATH.gameSchedule()).toBe('/api/fixtures');
  });
  it('pastGameDetail(gameId)는 /api/fixtures/:gameId/detail을 반환한다', () => {
    expect(API_PATH.pastGameDetail(42)).toBe('/api/fixtures/42/detail');
  });
  it('liveGameLineup(gameId)는 /api/fixtures/:gameId/lineups를 반환한다', () => {
    expect(API_PATH.liveGameLineup(42)).toBe('/api/fixtures/42/lineups');
  });
});

describe('FETCH_TIMEOUT_MICROSECOND', () => {
  it('5000ms이다', () => {
    expect(FETCH_TIMEOUT_MICROSECOND).toBe(5000);
  });
});
