import type { Route } from 'next';

/**
 * 선수별 상세 페이지 링크 생성. 라우트는 `/players/[playerId]` 동적 세그먼트(선수 상세 페이지와
 * 경로 통일)이며, 목업 단계이므로 `PlayerListItem.id`를 playerId로 그대로 사용한다.
 * `next.config.ts`에 `typedRoutes`가 켜져 있지 않아 `Route`는 사실상 string 별칭이라
 * 별도 타입 단언 없이 반환한다.
 */
export const playerDetailHref = (id: string): Route => `/players/${id}`;
