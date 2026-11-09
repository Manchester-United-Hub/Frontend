# BFF 경로 분리 (`app/api` → `app/bff`)

- 작성일: 2026-11-04
- 관련 이슈: #82
- 이전 문서: 없음

## 배경 · 목표

브라우저는 BFF(Next.js Route Handler)를 같은 출처의 `/api/v1/...`로 호출했다. 백엔드(Spring Boot)도 `/api/...`를 쓴다.
프론트와 백엔드를 같은 서버에 배포하고 nginx가 `/api/`를 Spring Boot로 라우팅하기 때문에, 브라우저의 BFF 요청이 Next까지 오지 못하고 Spring Boot에서 404가 났다. (예: 선수 상세 페이지에서 선수를 불러오지 못함)

목표: BFF 경로가 nginx의 `/api/` 라우팅과 겹치지 않게 한다. nginx 설정과 서버 → 백엔드 호출은 그대로 둔다.

## 설계

```
브라우저 ──GET /bff/v1/news──▶ [nginx location /] ──▶ Next : src/app/bff/v1/news/route.ts
브라우저 ──GET /api/**──────▶ [nginx location /api/] ──▶ Spring Boot
Server Component / Route Handler ──serverFetcher(API_BASE_URL)──▶ Spring Boot /api/**   (변경 없음)
```

| 구분 | 경로 | 정의 위치 |
| --- | --- | --- |
| BFF (브라우저가 호출) | `/bff/v1/...` | `BFF_PATH`, `src/app/bff/v1/**/route.ts` |
| 백엔드 | `/api/...` | `API_PATH` |

### 전제

- nginx는 `/api/` 외의 경로(`location /`)를 Next로 전달한다. `/bff/*`도 여기에 포함된다.

## 결정 사항

- Route Handler 폴더를 `app/api`에서 `app/bff`로 옮긴다 — BFF 경로가 파일 위치와 그대로 일치하고, 추가 실행 단계가 없다.
- 경로 이름은 `/bff` — 역할(BFF)이 이름에 드러나고 백엔드 경로와 겹치지 않는다.
- 대안 (채택 안 함): `src/proxy.ts`로 `/bff/*`를 `/api/*`로 rewrite. `proxy.ts`는 Next 안에서 실행되므로 nginx가 가로챈 `/api` 요청은 처리할 수 없고, 결국 `/bff` 공개 경로가 필요하다. 같은 결과에 파일 위치와 공개 경로가 달라지고 실행 단계가 하나 늘어서 채택하지 않았다.

## 변경 범위

| 파일 | 변경 |
| --- | --- |
| `src/app/api/v1/**` → `src/app/bff/v1/**` | Route Handler 12개 이동 |
| `test/app/api/v1/**` → `test/app/bff/v1/**` | 미러 테스트 이동, import·요청 경로 갱신 |
| `src/f_shared/api/configs/index.ts` | `BFF_PATH` 12개 `/api/v1/...` → `/bff/v1/...` |
| `src/e_entities/matches/api/client/pastMatchDetail.ts` | 경로 문자열을 직접 쓰던 것을 `BFF_PATH.pastMatchLineup()`으로 (안 바꾸면 이 호출만 계속 404) |
| `src/b_pages/apiTest/model/configs.ts` | 개발용 API 테스트 페이지 경로 갱신 |
| `test/f_shared/api/configs.test.ts`, `test/e_entities/*/api/client/*.test.ts` | BFF 경로 기대값 갱신 (스펙 변경) |
| `docs/architecture/{data-flow,env,routing,folder-structure,overview}.md` | BFF 경로·위치 갱신 |

hotfix 절차에 따라 코드는 `main` 기준 `hotfix/bff-route-conflict`로, 문서는 `dev` 기준 별도 PR로 반영한다. (`main`에는 `docs/`가 없다)

## 테스트 계획

| 대상 | 검증할 것 |
| --- | --- |
| `test/app/bff/v1/**/route.test.ts` | 기존 Route Handler 테스트가 새 위치에서 그대로 통과 |
| `test/f_shared/api/configs.test.ts` | `BFF_PATH`가 `/bff/v1/...`를 반환 |
| `test/e_entities/*/api/client/*.test.ts` | 클라이언트가 `/bff/v1/...`로 호출 |
| 통합 | `pnpm build` 라우트 목록에 `/bff/v1/*`, `pnpm start` 후 `curl /bff/v1/*` 200 · `/api/v1/*` 404 |

## 위험

- nginx에 `/bff`를 다른 곳으로 보내는 `location`이 생기면 다시 깨진다.
- 앞으로 `app/api/` 아래에 Route Handler를 만들면 운영에서 같은 문제가 난다. → [routing § API 경로](../../architecture/routing.md#api-경로)

## 미해결

- 배포 후 운영 주소에서 `/bff/v1/*` 응답 확인
