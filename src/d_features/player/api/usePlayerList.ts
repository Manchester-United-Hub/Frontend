import { useQuery } from '@tanstack/react-query';

import type { PlayerListQueryDTO } from '@entities/player/model';

import { playerQueries } from './playerQueries';

/** season은 서버(app/players/page.tsx)가 확정해 prop으로 내리므로 여기서는 게이팅하지 않는다(S-9). */
const usePlayerList = (query: PlayerListQueryDTO) => useQuery(playerQueries.list(query));

export { usePlayerList };
