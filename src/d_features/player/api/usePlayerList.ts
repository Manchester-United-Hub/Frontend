import { useQuery } from '@tanstack/react-query';

import type { PlayerListQueryDTO } from '@entities/player/model';

import { playerQueries } from './playerQueries';

const usePlayerList = (query: PlayerListQueryDTO) => useQuery(playerQueries.list(query));

export { usePlayerList };
