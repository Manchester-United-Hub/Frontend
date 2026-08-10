import type { Match, HaFilter } from '@entities/matches/model';
import { MatchMonthGroup } from './types';

interface FilterMatchesCriteria {
  ha: HaFilter;
}

const matchesHa = (Match: Match, ha: HaFilter): boolean =>
  ha === 'all' || Match.ha === ha;

const groupByMonth = (matches: Match[]): MatchMonthGroup[] => {
  const groupsByMonth = new Map<string, MatchMonthGroup>();

  matches.forEach((Match) => {
    const existing = groupsByMonth.get(Match.month);
    if (existing) {
      existing.matches.push(Match);
      return;
    }
    groupsByMonth.set(Match.month, { month: Match.month, matches: [Match] });
  });

  return [...groupsByMonth.values()];
};

const filterMatches = (
  matches: Match[],
  criteria: FilterMatchesCriteria
): MatchMonthGroup[] => {
  const filtered = matches.filter((Match) => matchesHa(Match, criteria.ha));

  return groupByMonth(filtered);
};

export { filterMatches };
export type { FilterMatchesCriteria };
