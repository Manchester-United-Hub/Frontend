import { queryOptions } from '@tanstack/react-query';

import type { PlayerListQueryDTO, PlyaerListDTO } from '@entities/player/model';

import { PLAYER_LIST_STALE_TIME_MS } from './configs';
import { getPlayerRoster } from './getPlayerRoster';
import { playerKeys } from './playerKeys';
import { rosterListQuery } from './rosterListQuery';

/**
 * getPlayerRoster가 null이면(상류 실패) throw한다. prefetchQuery는 이 throw를 재던지지
 * 않고 실패 쿼리를 dehydrate 대상에서 제외하므로, 클라이언트가 마운트 후 기존 BFF 경로로
 * 이어받는다(A-6, graceful degradation).
 *
 * ⚠️ 서버 전용 모듈이다 — 이 파일은 d_features/player/api/index.ts 배럴에 재노출하지
 * 않는다(AD-1/S-6, newsServerQueries.ts와 동일한 경계).
 */
const fetchPlayerRosterOnServer = async (query: PlayerListQueryDTO): Promise<PlyaerListDTO> => {
  const data = await getPlayerRoster(query);
  if (!data) {
    throw new Error('player roster fetch failed');
  }
  return data;
};

const playerServerQueries = {
  list: (seasonStartYear: number) => {
    const query = rosterListQuery(seasonStartYear);
    return queryOptions({
      queryKey: playerKeys.list(query),
      queryFn: () => fetchPlayerRosterOnServer(query),
      staleTime: PLAYER_LIST_STALE_TIME_MS,
    });
  },
};

export { playerServerQueries };
