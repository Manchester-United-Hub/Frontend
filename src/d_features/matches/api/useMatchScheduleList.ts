import { useQuery } from '@tanstack/react-query';
import { matchesQueries } from './matchesQueries';

const useMatchScheduleList = () => useQuery(matchesQueries.scheduleList());

export { useMatchScheduleList };
