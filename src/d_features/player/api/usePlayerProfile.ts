import { useQuery } from '@tanstack/react-query';

import { playerQueries } from './playerQueries';

const usePlayerProfile = (playerId: number, season: number) =>
  useQuery(playerQueries.profile(playerId, season));

export { usePlayerProfile };
