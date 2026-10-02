// 서버 전용. 클라이언트 모듈에서 import 금지.
// getSchedule.ts와 동일한 형태 — 'use cache' 없는 단일 함수, 상류 실패·throw는 전부 null로
// 흡수한다. season은 getSeasonInfo()로 확정한다(season 값의 단일 출처, D-4).
import { fetchMatchScheduleList } from './matchScheduleList';
import { convertMatchesDTO2DAO, pickLandingMatches } from '@entities/matches/utils';
import { buildCountdownLabel } from '@entities/matches/utils/buildCountdownLabel';
import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

/**
 * next의 countdown을 BFF 페이로드 경계에서 항상 재계산해 덮어쓴다(High-2 부수 쟁점, D-11).
 * 상류(`convertMatchesDTO2DAO`)가 붙인 countdown은 배열 인덱스 0에만 존재해 pickLandingMatches가
 * 인덱스 0이 아닌 항목을 next로 고르면 비어 있다 — `??` 폴백을 쓰면 D-배지 유무가 다시
 * 상류 배열 순서의 함수가 되므로 항상 계산한다. pickLandingMatches 자체는 순수 선별 함수로
 * 남기고, 이 경계에서만 next 객체를 새로 만든다.
 *
 * ⚠️ 이 계산은 반드시 서버에 남는다. kickoff(`yyyy-MM-ddTHH:mm:ss`)에 오프셋이 없어
 * `new Date(kickoff)`가 로컬 시간으로 파싱되므로, 클라이언트에서 계산하면 뷰어 타임존만큼
 * (KST 기준 9시간) 밀려 D-day가 하루 어긋나고 SSR 결과와 hydration mismatch가 난다.
 */
const withRecomputedCountdown = (
  landingMatches: LandingMatches,
  now: Date
): LandingMatches => {
  if (landingMatches.next == null) {
    return landingMatches;
  }
  return {
    ...landingMatches,
    next: {
      ...landingMatches.next,
      countdown: buildCountdownLabel(landingMatches.next.kickoff, now),
    },
  };
};

const getLandingMatches = async (): Promise<LandingMatches | null> => {
  try {
    const { startYear } = await getSeasonInfo();
    const result = await fetchMatchScheduleList({ season: String(startYear) });
    if (!result.isSuccess) {
      return null;
    }
    const matches = convertMatchesDTO2DAO(result.data);
    const landingMatches = pickLandingMatches(matches);
    return withRecomputedCountdown(landingMatches, new Date());
  } catch {
    // serverFetcher(AbortController 타임아웃)가 throw할 수 있다. getSeasonInfo() 자체는
    // throw하지 않지만(내부 fallback) 방어적으로 같은 경계 안에 둔다.
    return null;
  }
};

export { getLandingMatches };
