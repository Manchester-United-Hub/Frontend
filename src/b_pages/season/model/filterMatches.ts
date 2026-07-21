/**
 * filterMatches — 일정 필터링 + 월별 그룹핑 순수 함수 (ST-01, 이슈 #29).
 *
 * - 홈/원정(ha)·대회(comp) 필터를 AND로 결합한다 ('all'은 항상 통과).
 * - 필터링된 결과를 `Match.month`로 그룹핑한다. month가 처음 등장한 순서로
 *   그룹을 만들고(입력 순서 보존), 같은 month는 비연속으로 흩어져 있어도 하나의
 *   그룹에 모은다 — 실 API(getMatchScheduleList)가 비정렬 배열을 줘도 중복 그룹이
 *   생기지 않는다.
 *
 * 입력→출력만 있는 순수 함수 — 부수효과 없음. 단위 테스트 대상.
 */

import type { CompFilter, Match, MatchMonthGroup, HaFilter } from './types';

interface FilterMatchesCriteria {
  ha: HaFilter;
  comp: CompFilter;
}

const matchesHa = (Match: Match, ha: HaFilter): boolean =>
  ha === 'all' || Match.ha === ha;

const matchesComp = (Match: Match, comp: CompFilter): boolean =>
  comp === 'all' || Match.comp === comp;

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
  const filtered = matches.filter(
    (Match) =>
      matchesHa(Match, criteria.ha) && matchesComp(Match, criteria.comp)
  );

  return groupByMonth(filtered);
};

export { filterMatches };
export type { FilterMatchesCriteria };
