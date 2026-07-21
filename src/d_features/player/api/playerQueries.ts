import { queryOptions } from '@tanstack/react-query';

import { getPlayerList } from '@entities/player/api/client';
import type { PlayerListQueryDTO } from '@entities/player/model';

import { playerKeys } from './playerKeys';

const playerQueries = {
  list: (query: PlayerListQueryDTO) =>
    queryOptions({
      queryKey: playerKeys.list(query),
      queryFn: () => getPlayerList(query),
    }),
};

export { playerQueries };
