# 라우팅

## 페이지 목록

| 페이지 | URL | `b_pages` | 데이터 |
| --- | --- | --- | --- |
| 홈 | `/` | `landing` | 실 API (경기·스쿼드 프리뷰) |
| 시즌 (일정·결과·순위) | `/season` | `season` | 실 API |
| 선수 목록 | `/players` | `playerList` | 실 API |
| 선수 상세 | `/players/[playerId]` | `playerDetail` | 실 API (클라이언트 조회) |
| 구단 | `/club` | `clubInfo` | 목데이터 (`model/mockData.ts`) |
| 기사 | `/news` | `news` | 실 API |
| 하이라이트 | `/highlights` | `highlights` | 준비 중 화면 |
| 404 | — | `notFound` | — |
| API 테스트 (개발용) | `/api-test` | `apiTest` | BFF 호출 도구 |

## 경로 상수: `routes`

- 내부 경로 문자열은 `f_shared/utils/routes.ts`의 `routes` 한 곳에서만 정의한다.
- `href`, `router.push`, `redirect`에 경로 문자열을 직접 쓰지 않는다. (`href="/players"` ✗ → `href={routes.players()}`)
- 동적 세그먼트가 있는 경로도 `routes`에 함수로 둔다. (예: `routes.playerDetail(id)`)
- 실제 `page.tsx`가 있는 경로만 등록한다. 만들지 않은 페이지를 미리 등록하면 dead link가 된다.
- 새 페이지를 만들면 같은 PR에서 `routes`에 추가한다.

```ts
const routes = {
  home: (): Route => '/',
  season: (): Route => '/season',
  players: (): Route => '/players',
  playerDetail: (playerId: string): Route => `/players/${playerId}`,
} as const;
```

## 내비게이션 메뉴

- 메뉴 정보는 `c_widgets/Navbar/model/configs.ts`의 `NAV_ITEMS` 배열에 둔다. 메뉴 순서는 배열 순서를 따른다.
- 내부 링크의 `href`는 `routes`를 쓴다. 외부 링크(공식 Store)는 `isOuterLink: true`로 표시한다.

## API 경로

- 백엔드 경로는 `API_PATH`, BFF 경로는 `BFF_PATH`에 둔다. → [data-flow](data-flow.md)
- BFF Route Handler는 `app/bff/v1/[domain]/...`에 둔다.
- `app/api/`는 쓰지 않는다. 운영 nginx가 `/api/`를 백엔드로 보내 Next에 도달하지 않는다. → [feature/infra/2026-11-04-bff-route-path](../feature/infra/2026-11-04-bff-route-path.md)

현재 코드와 다른 부분은 [known-gaps](../known-gaps.md)에 있다.
