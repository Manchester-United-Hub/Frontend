import { PLRankDTO, RankSeasonDTOSchema } from '@entities/rank/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult, toServerApiResult } from '@shared/model';

const getPremierLeagueRank = async (): Promise<ServerApiResult<PLRankDTO>> => {
  const response = await serverFetcher.get(API_PATH.plRank());
  const data = await response.json();

  return toServerApiResult<PLRankDTO>(response, data, RankSeasonDTOSchema);
};

export { getPremierLeagueRank };
