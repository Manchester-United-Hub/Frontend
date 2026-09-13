import { useQuery } from '@tanstack/react-query';

import { matchQueries } from './matchQueries';

const useLandingMatches = () => useQuery(matchQueries.landing());

export { useLandingMatches };
