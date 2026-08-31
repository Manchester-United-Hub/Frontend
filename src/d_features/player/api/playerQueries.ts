import { queryOptions } from '@tanstack/react-query';

import { getPlayerList } from '@entities/player/api/client';
import type { PlayerListQueryDTO, PlyaerListDTO } from '@entities/player/model';

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

const playerQueries = {
  list: (query: PlayerListQueryDTO) =>
    queryOptions({
      queryKey: playerKeys.list(query),
      queryFn: () => fetchPlayerListViaBff(query),
      staleTime: PLAYER_LIST_STALE_TIME_MS,
    }),
};

export { playerQueries };
