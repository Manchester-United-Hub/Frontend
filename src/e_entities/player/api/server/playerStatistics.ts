import { PlayerListQueryDTO, PlayerStatisticsListDTO } from '@entities/player/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ApiErrorResponse, ServerApiResult } from '@shared/model';

// 외부 API(/api/player-details/{playerId})는 { player, statistics } 형태로 응답하지만
// (D-19 — 이 브랜치는 player 프로필을 /api/players/{playerId}에서 별도로 받는다), 이 슬라이스는
// statistics 배열만 필요하므로 응답에서 statistics만 추출해 반환한다.
type PlayerDetailApiResponse = {
  statistics: PlayerStatisticsListDTO;
};

const fetchPlayerStatistics = async (
  playerId: number,
  query: PlayerListQueryDTO
): Promise<ServerApiResult<PlayerStatisticsListDTO>> => {
  const response = await serverFetcher.get(API_PATH.playerStatistics(playerId), query);
  const data = await response.json();
  if (response.ok) {
    const { statistics } = data as PlayerDetailApiResponse;
    return { isSuccess: true, status: response.status, data: statistics };
  }
  return { isSuccess: false, status: response.status, data: data as ApiErrorResponse };
};

export { fetchPlayerStatistics };
