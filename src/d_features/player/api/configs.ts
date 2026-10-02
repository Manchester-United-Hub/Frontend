/**
 * hydration 직후 즉시 refetch를 막는 신선도 창(A-3/S-8) — 'use cache'(cacheLife('hours') →
 * revalidate 3600s) · app/players/page.tsx(export const revalidate = 3600) · 이 값이 모두
 * 같은 3600초를 가리켜야 3층 캐시가 서로를 무효화하지 않는다. playerQueries·playerServerQueries가
 * 이 값을 공유한다.
 */
const PLAYER_LIST_STALE_TIME_MS = 3_600_000;

export { PLAYER_LIST_STALE_TIME_MS };
