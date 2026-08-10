import { queryOptions } from '@tanstack/react-query';

import { getPlayerList, getPlayerProfile, getPlayerStatistics } from '@entities/player/api/client';
import type { PlayerListQueryDTO } from '@entities/player/model';

import { playerKeys } from './playerKeys';

const playerQueries = {
  // 기존 list는 언랩 없이 BffApiResponse 그대로 반환한다(D-7/AD-1 예외 — 수정하지 않음).
  list: (query: PlayerListQueryDTO) =>
    queryOptions({
      queryKey: playerKeys.list(query),
      queryFn: () => getPlayerList(query),
    }),
  // profile/statistics는 신규 쿼리라 AD-1 표준 언랩 패턴을 따른다(D-25) — !success면 throw해
  // react-query가 isError로 전이시키고, 성공 시에는 unwrap된 data만 반환한다.
  profile: (playerId: number, season: number) =>
    queryOptions({
      queryKey: playerKeys.profile(playerId, season),
      queryFn: async () => {
        const response = await getPlayerProfile(playerId, { season });
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
  statistics: (playerId: number, season: number) =>
    queryOptions({
      queryKey: playerKeys.statistics(playerId, season),
      queryFn: async () => {
        const response = await getPlayerStatistics(playerId, { season });
        if (!response.success) {
          throw new Error(response.error.message);
        }
        return response.data;
      },
    }),
};

export { playerQueries };
