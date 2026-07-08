/**
 * filterFixtures — 일정 필터링 + 월별 그룹핑 순수 함수 (ST-01, 이슈 #29).
 *
 * - 홈/원정(ha)·대회(comp) 필터를 AND로 결합한다 ('all'은 항상 통과).
 * - 필터링된 결과를 `Fixture.month`로 그룹핑한다. month가 처음 등장한 순서로
 *   그룹을 만들고(입력 순서 보존), 같은 month는 비연속으로 흩어져 있어도 하나의
 *   그룹에 모은다 — 실 API(getGameScheduleList)가 비정렬 배열을 줘도 중복 그룹이
 *   생기지 않는다.
 *
 * 입력→출력만 있는 순수 함수 — 부수효과 없음. 단위 테스트 대상.
 */

import type { CompFilter, Fixture, FixtureMonthGroup, HaFilter } from './types';

interface FilterFixturesCriteria {
  ha: HaFilter;
  comp: CompFilter;
}

const matchesHa = (fixture: Fixture, ha: HaFilter): boolean => ha === 'all' || fixture.ha === ha;

const matchesComp = (fixture: Fixture, comp: CompFilter): boolean =>
  comp === 'all' || fixture.comp === comp;

const groupByMonth = (fixtures: Fixture[]): FixtureMonthGroup[] => {
  const groupsByMonth = new Map<string, FixtureMonthGroup>();

  fixtures.forEach((fixture) => {
    const existing = groupsByMonth.get(fixture.month);
    if (existing) {
      existing.fixtures.push(fixture);
      return;
    }
    groupsByMonth.set(fixture.month, { month: fixture.month, fixtures: [fixture] });
  });

  return [...groupsByMonth.values()];
};

const filterFixtures = (
  fixtures: Fixture[],
  criteria: FilterFixturesCriteria,
): FixtureMonthGroup[] => {
  const filtered = fixtures.filter(
    (fixture) => matchesHa(fixture, criteria.ha) && matchesComp(fixture, criteria.comp),
  );

  return groupByMonth(filtered);
};

export { filterFixtures };
export type { FilterFixturesCriteria };
