import { useQuery } from '@tanstack/react-query';

import { seasonQueries } from './seasonQueries';

const useCurrentSeason = () => useQuery(seasonQueries.current());

export { useCurrentSeason };
