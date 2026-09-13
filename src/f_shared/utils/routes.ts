import type { Route } from 'next';

/**
 * 앱 내부 라우트 단일 소스. `src/app` 하위에 실제 page가 존재하는 경로만 노출한다
 * (아직 만들지 않은 페이지를 미리 등록하면 dead link가 된다 — ADR-7).
 * `next.config.ts`에 `typedRoutes`가 꺼져 있어 `Route`는 사실상 string 별칭이다.
 * 선수 상세(`/players/[playerId]`)는 `playerDetailHref`가 담당하며 후속 리팩토링에서 합류한다.
 */
const routes = {
  home: (): Route => '/',
  season: (): Route => '/season',
  players: (): Route => '/players',
  club: (): Route => '/club',
  highlights: (): Route => '/highlights',
  news: (): Route => '/news',
} as const;

export { routes };
