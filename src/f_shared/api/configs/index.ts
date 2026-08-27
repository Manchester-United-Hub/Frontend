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
  plRank() {
    return '/api/rank/premier-league';
  },
  plRankDetail(detail: 'topscorers' | 'topassists') {
    return `/api/rank/premier-league/${detail}`;
  },
  currentSeason() {
    return `/api/seasons/current`;
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
  teamInfo(teamId: string | number) {
    return `/api/v1/team/${teamId}`;
  },
  teamStatistics() {
    return '/api/v1/team/statistics';
  },
  premierLeagueRank() {
    return `/api/v1/rank/pl`;
  },
  currentSeason() {
    return `/api/v1/season`;
  },
};

export { BASE_URL, FETCH_TIMEOUT_MICROSECOND, API_PATH, BFF_PATH };
