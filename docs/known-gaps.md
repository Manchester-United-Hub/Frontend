# 규칙과 다른 기존 코드

docs 규칙을 정한 시점(2026-10-28)에 규칙과 맞지 않는 기존 코드 목록이다. 새 코드는 규칙을 따르고, 아래 항목은 별도 이슈로 정리한다. 정리가 끝난 항목은 이 표에서 지운다.

| # | 규칙 | 현재 코드 | 정리 방향 |
| --- | --- | --- | --- |
| 1 | 타입·스키마는 `model/`에 둔다 → [folder-structure](architecture/folder-structure.md#슬라이스-구조) | `e_entities/matches`, `e_entities/rank`가 `types/`·`types/schemas/` 사용, `seasonInfo`가 `model/types/` 폴더 사용 | `model/types.ts`, `model/schemas/`로 이동 |
| 2 | 타입 파일은 `types.ts` → [naming](convention/naming.md#파일) | `e_entities/{news,player,team}/model/type.ts` | `types.ts`로 이름 변경 |
| 3 | 같은 레이어 슬라이스 간 import 금지 → [folder-structure](architecture/folder-structure.md#레이어) | `e_entities/matches/api/server/getLandingMatches.ts` → `@entities/seasonInfo/api/server` | 시즌 값을 인자로 받고 상위 레이어에서 조합 |
| 4 | `app/`에 화면 컴포넌트를 두지 않는다 → [folder-structure](architecture/folder-structure.md#app-nextjs-라우트) | `app/highlights/_components/HighlightsComingSoon.tsx` | `b_pages/highlights`로 이동 |
| 5 | 컴포넌트는 함수 선언 → [typescript](convention/typescript.md#함수-선언-형태) | `f_shared/ui`의 `Button`, `Card`, `Shell`, `Skeleton`, `BilingualLabel`, `CategoryCard` 등이 화살표 함수 | 함수 선언으로 변경 |
| 6 | 유틸·헬퍼는 화살표 함수 → [typescript](convention/typescript.md#함수-선언-형태) | `handleImageError`, `matchesPanelHead`, `mapApiPositionToCode`, `HeroSection`·`HexRadar`·`PlayerInfoGrid` 내부 헬퍼 | 화살표 함수로 변경 |
| 7 | 파일 끝에서 `export { }` → [typescript](convention/typescript.md#export) | 약 120개 파일이 `export const` / `export function` 사용 | 파일 끝 export로 변경 |
| 8 | 결정 ID 참조·불필요한 JSDoc 금지 → [comment](convention/comment.md) | JSDoc 약 410곳, 결정 ID 참조(ADR-, D-, S-, AD- 등) 약 325곳, 주석 처리한 코드(`env.ts`, `globals.css`, `PlayerDetailPage`) | 필요한 맥락은 본문으로 풀어 쓰거나 `docs/feature/`로 이동, 나머지 삭제 |
| 9 | 변환 함수는 `toXxx` / `selectXxx` → [naming](convention/naming.md#dto--변환-함수) | `convertMatchesDTO2DAO`, `convertPLRankDTO2DAO`, `mapPlayerDtoToListItem`, `mapProfileDtoToPlayerDetail`, `mapApiPositionToCode` | 이름 변경 |
| 10 | DTO 표기 → [naming](convention/naming.md#dto--변환-함수) | 오타 `PlyaerDTO`, `PlyaerListDTO` (약 38곳) | `PlayerDTO`, `PlayerListDTO`로 변경 |
| 11 | 컴포넌트 파일 이름은 폴더와 같게 → [naming](convention/naming.md#파일) | `f_shared/ui/Button/CustomButton.tsx`, `f_shared/ui/Panel/PanelHead.tsx` | 폴더 또는 파일 이름 정리 |
| 12 | 캐시 수명표 → [rendering § 캐시](architecture/rendering.md#캐시) | news: `revalidate 300` vs `staleTime 60_000`, rank: BFF `revalidate 60` vs `cacheLife('hours')` | 도메인별 값 하나로 통일 |
| 13 | 시즌 값은 `getSeasonInfo` 한 곳에서 → [data-flow](architecture/data-flow.md) | `b_pages/playerDetail/PlayerDetailPage.tsx`의 `CURRENT_SEASON = 2025` 하드코딩 | 서버에서 `getSeasonInfo` 값을 props로 전달 |
| 14 | BFF 에러 코드는 `f_shared` 목록 + 이름 코드 → [data-flow § BFF 에러 코드](architecture/data-flow.md#bff-에러-코드) | Route Handler마다 상수 선언, `rank/[league]/route.ts`가 `'400'`·`'500'` 사용, news가 `INVALID_RESPONSE_SCHEMA`(= `UPSTREAM_CONTRACT_MISMATCH`와 같은 의미) 사용 | 목록 생성 후 교체 |
| 15 | 내부 경로는 `routes` → [routing](architecture/routing.md#경로-상수-routes) | `NAV_ITEMS`의 `href` 문자열, `BackLink`(`"/players"`), `Logo`(`"/"`), 선수 상세는 `e_entities/player/model/playerDetailHref` | `routes`로 모으고 `routes.playerDetail` 추가 |
| 16 | env는 zod 검증 후 사용 → [env](architecture/env.md#접근-방식) | `f_shared/utils/env.ts`가 검증 없이 `process.env`를 그대로 export (스키마 주석 처리) | 스키마 복구 (`API_BASE_URL`) |
| 17 | 테스트 env 키 이름 일치 → [env](architecture/env.md#접근-방식) | `vitest.config.ts`가 `BASE_URL`을 주입, 코드는 `API_BASE_URL`을 읽음 | `API_BASE_URL`로 변경 |
| 18 | `.env.example` 커밋 → [env](architecture/env.md#파일) | 파일 없음 | 추가 |
| 19 | 빌드 인자로 `API_BASE_URL` 전달 → [ci](collaboration/ci.md#배포) | `deploy.yml`은 `--build-arg`로 넘기지만 `Dockerfile`에 `ARG`가 없음 | `Dockerfile` builder 스테이지에 `ARG`/`ENV` 추가 |
