import { env } from '@shared/utils';

const BASE_URL = env().baseUrl || '';

const FETCH_TIMEOUT_SECOND = 5000;

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
  team(teamId: number) {
    return `/api/teams/${teamId}`;
  },
  playerList() {
    return '/api/players';
  },
  gameSchedule() {
    return '/api/fixtures';
  },
  pastGameDetail(gameId: number) {
    return `/api/fixtures/${gameId}/detail`;
  },
  liveGameLineup(gameId: number) {
    return `/api/fixtures/${gameId}/lineups`;
  },
};

export { BASE_URL, FETCH_TIMEOUT_SECOND, API_PATH };
