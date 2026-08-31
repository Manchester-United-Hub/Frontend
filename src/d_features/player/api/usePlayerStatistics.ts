import { useQuery } from '@tanstack/react-query';

import { playerQueries } from './playerQueries';

const usePlayerStatistics = (playerId: number, season: number) =>
  useQuery(playerQueries.statistics(playerId, season));

export { usePlayerStatistics };
