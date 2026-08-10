import { useQuery } from '@tanstack/react-query';
import { premierLeagueRankQueries } from './premierLeagueRankQueries';

const usePLRankList = () => useQuery(premierLeagueRankQueries.rank());

export { usePLRankList };
