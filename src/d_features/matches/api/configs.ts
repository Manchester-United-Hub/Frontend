/**
 * hydration 직후 즉시 refetch를 막는 신선도 창(D-7) — app/page.tsx(export const revalidate = 300)와
 * 이 값이 같은 300초를 가리켜야 SSR prefetch(matchServerQueries)와 CSR hydrate(matchQueries)가
 * 서로를 무효화하지 않는다. matchQueries·matchServerQueries가 이 값을 공유한다.
 */
const LANDING_MATCHES_STALE_TIME_MS = 300_000;

export { LANDING_MATCHES_STALE_TIME_MS };
