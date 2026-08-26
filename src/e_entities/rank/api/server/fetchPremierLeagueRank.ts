import {
  PLRankDTO,
  PLRankParams,
  RankSeasonDTOSchema,
} from '@entities/rank/types';
import { API_PATH, serverFetcher } from '@shared/api';
import { ServerApiResult, toServerApiResult } from '@shared/model';

// D-4/A-6: 실제 백엔드(/api/rank/premier-league)로 나가는 쿼리가 조립되는 지점.
// 백엔드 파라미터명이 바뀌면 이 함수의 query 객체 키만 수정하면 된다(단일 수정 지점).
const getPremierLeagueRank = async (
  params?: PLRankParams
): Promise<ServerApiResult<PLRankDTO>> => {
  const response = await serverFetcher.get(API_PATH.plRank(), params);
  const data = await response.json();

  return toServerApiResult<PLRankDTO>(response, data, RankSeasonDTOSchema);
};

export { getPremierLeagueRank };
