import { MAX_PAGE_SIZE } from '@entities/player/model';
import type { PlayerListQueryDTO } from '@entities/player/model';

/**
 * PlayerListQueryDTO의 유일한 생성 지점(A-5/S-5) — 서버 prefetch(playerServerQueries)와
 * 클라이언트 훅(usePlayerList)이 모두 이 팩토리로만 쿼리 객체를 만든다. 어느 쪽이든
 * { season, size } 리터럴을 직접 쓰면 queryKey가 갈라져 하이드레이션 캐시가 조용히
 * 버려진다(에러 없이 이중 조회만 난다 — 가장 탐지하기 어려운 실패다).
 *
 * size는 MAX_PAGE_SIZE(100) 그대로 — 필터·검색이 클라이언트에서 전체 스쿼드를 대상으로
 * 돌기 때문에 서버 페이징으로 바꾸지 않는다.
 */
const rosterListQuery = (seasonStartYear: number): PlayerListQueryDTO => ({
  season: seasonStartYear,
  size: MAX_PAGE_SIZE,
});

export { rosterListQuery };
