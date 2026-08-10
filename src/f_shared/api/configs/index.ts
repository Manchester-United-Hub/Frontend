import { env } from '@shared/utils';

const BASE_URL = env['API_BASE_URL'] || '';

const FETCH_TIMEOUT_MICROSECOND = 5000;

const API_PATH = {
  newsList() {
    return '/api/news';
  },
  recentNews() {
    return '/api/news/recent';
  },
  teamStatistics() {
    return '/api/team/statistics';
  },
  team(teamId: number | string) {
    return `/api/teams/${teamId}`;
  },
  playerList() {
    return '/api/players';
  },
  playerDetail(playerId: number | string) {
    return `/api/players/${playerId}`;
  },
  playerStatistics(playerId: number | string) {
    return `/api/player-details/${playerId}`;
  },
  matchSchedule() {
    return '/api/matches';
  },
  matchScheduleDetail(matchId: number | string) {
    return `/api/matches/${matchId}`;
  },
  pastMatchDetail(matchId: number | string) {
    return `/api/matches/${matchId}/detail`;
  },
  liveMatchLineup(matchId: number | string) {
    return `/api/matches/${matchId}/lineups`;
  },
};

const BFF_PATH = {
  matchSchedule() {
    return '/api/v1/match/schedule';
  },
  liveMatchLineup(matchId: number | string) {
    return `/api/v1/match/${matchId}/lineups`;
  },
  pastMatchLineup(matchId: number | string) {
    return `/api/v1/match/${matchId}/detail`;
  },
  newsList() {
    return '/api/v1/news';
  },
  playerList() {
    return '/api/v1/player';
  },
  playerProfile(playerId: number | string) {
    return `/api/v1/player/${playerId}`;
  },
  playerStatistics(playerId: number | string) {
    return `/api/v1/player-details/${playerId}`;
  },
  teamInfo(teamId: string | number) {
    return `/api/v1/team/${teamId}`;
  },
  teamStatistics() {
    return '/api/v1/team/statistics';
  },
};

export { BASE_URL, FETCH_TIMEOUT_MICROSECOND, API_PATH, BFF_PATH };
