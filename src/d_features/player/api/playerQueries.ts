import { queryOptions } from '@tanstack/react-query';

import { getPlayerList, getPlayerProfile, getPlayerStatistics } from '@entities/player/api/client';
import type {
  PlayerListQueryDTO,
  PlyaerDTO,
  PlyaerListDTO,
  PlayerStatisticsListDTO,
} from '@entities/player/model';

import { PLAYER_LIST_STALE_TIME_MS } from './configs';
import { playerKeys } from './playerKeys';

/** BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다(AD-1 표준, S-6). */
const fetchPlayerListViaBff = async (query: PlayerListQueryDTO): Promise<PlyaerListDTO> => {
  const response = await getPlayerList(query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

/** BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다(AD-1 표준, S-6). */
const fetchPlayerProfileViaBff = async (
  playerId: number,
  query: PlayerListQueryDTO
): Promise<PlyaerDTO> => {
  const response = await getPlayerProfile(playerId, query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

/** BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다(AD-1 표준, S-6). */
const fetchPlayerStatisticsViaBff = async (
  playerId: number,
  query: PlayerListQueryDTO
): Promise<PlayerStatisticsListDTO> => {
  const response = await getPlayerStatistics(playerId, query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const playerQueries = {
  list: (query: PlayerListQueryDTO) =>
    queryOptions({
      queryKey: playerKeys.list(query),
      queryFn: () => fetchPlayerListViaBff(query),
      staleTime: PLAYER_LIST_STALE_TIME_MS,
    }),
  // profile/statistics는 신규 쿼리라 AD-1 표준 언랩 패턴을 따른다(D-25) — !success면 throw해
  // react-query가 isError로 전이시키고, 성공 시에는 unwrap된 data만 반환한다.
  profile: (playerId: number, season: number) =>
    queryOptions({
      queryKey: playerKeys.profile(playerId, season),
      queryFn: () => fetchPlayerProfileViaBff(playerId, { season }),
    }),
  statistics: (playerId: number, season: number) =>
    queryOptions({
      queryKey: playerKeys.statistics(playerId, season),
      queryFn: () => fetchPlayerStatisticsViaBff(playerId, { season }),
    }),
};

export { playerQueries };
