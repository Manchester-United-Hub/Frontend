# 폴더 구조

FSD(Feature-Sliced Design)를 따른다. 레이어 폴더에 알파벳 접두사를 붙여 의존 방향을 이름 순서로 드러낸다.

## 레이어

```
src/
├── app/          # Next.js 라우트 + BFF Route Handler + 전역 providers·스타일
├── b_pages/      # 페이지 단위 조합 (landing, season, playerList, playerDetail, clubInfo, news, highlights, notFound)
├── c_widgets/    # 여러 feature/entity를 조합한 큰 UI 블록 (Navbar, Footer, MatchSchedule, Standing, PlayerRoster)
├── d_features/   # 데이터 조회·필터 등 사용자 행동 단위 (matches, news, player, rank, seasonInfo)
├── e_entities/   # 도메인 (matches, news, player, rank, seasonInfo, team)
└── f_shared/     # 도메인을 모르는 공용 코드 (ui, api, model, utils, configs)
```

- 상위 레이어는 하위 레이어만 import한다. (`app` → `b_pages` → `c_widgets` → `d_features` → `e_entities` → `f_shared`)
- **하위 레이어는 상위 레이어를 import하지 않는다.** 특히 `f_shared`는 어떤 상위 레이어도 import하지 않는다.
- `app/`은 Next.js 라우팅 폴더이므로 접두사를 붙이지 않는다.
- **같은 레이어의 다른 슬라이스는 import하지 않는다.** (예: `e_entities/matches` → `e_entities/seasonInfo` 금지) 함께 필요하면 상위 레이어에서 조합한다.
- `e_entities`의 슬라이스는 [overview § 도메인](overview.md#도메인)과 맞춘다.

## 경로 별칭

| 별칭 | 경로 |
| --- | --- |
| `@app` | `src/app` |
| `@pages` | `src/b_pages` |
| `@widgets` | `src/c_widgets` |
| `@features` | `src/d_features` |
| `@entities` | `src/e_entities` |
| `@shared` | `src/f_shared` |
| `@test` | `test` |

- `tsconfig.json`의 `paths`와 `vitest.config.ts`의 `resolve.alias`를 함께 맞춘다.

## app/ (Next.js 라우트)

`page.tsx`, `layout.tsx`는 라우트 관심사만 다루고, 화면은 `b_pages`에 맡긴다.

`app/`에는 화면 컴포넌트를 두지 않는다. (`_components/` 금지)

| `page.tsx`에서 하는 일 | `b_pages`에서 하는 일 |
| --- | --- |
| `params` 처리 | 화면 구성 (widgets/features/entities 조합) |
| `revalidate` 등 라우트 세그먼트 설정 | |
| 데이터 prefetch → `HydrationBoundary` | |
| 결과를 props로 `b_pages`에 전달 | |

| 폴더 | 내용 |
| --- | --- |
| `app/api/v1/` | BFF Route Handler → [data-flow](data-flow.md) |
| `app/providers/` | `TanstackQueryProvider` |
| `app/(dev)/` | 개발용 페이지 (`/api-test`) |

## 슬라이스 구조

슬라이스 안은 아래 세그먼트로 나눈다. 필요한 것만 만든다.

| 세그먼트 | 내용 |
| --- | --- |
| `ui/` | 컴포넌트 |
| `api/` | API 호출 함수. `e_entities`는 `server/`·`client/`로 나눈다 |
| `model/` | 타입(`types.ts`), zod 스키마(`schemas/`), 순수 로직, 훅 |
| `utils/` | 슬라이스 전용 유틸 (DTO 변환 등) |
| `configs/` | 슬라이스 전용 상수 |

- 타입·스키마는 `model/`에 둔다. 별도 `types/` 세그먼트를 만들지 않는다.
- 타입 파일 이름은 `types.ts`로 통일한다. (`type.ts` ✗)

```
e_entities/news/
├── api/
│   ├── server/   # serverFetcher → 백엔드
│   └── client/   # clientFetcher → BFF
└── model/
    ├── schemas/
    └── types.ts

d_features/news/
└── api/          # newsKeys, *QueryOptions, newsQueries, newsServerQueries, useXxx

b_pages/news/
├── NewsPage.tsx
├── model/
├── ui/
└── utils/
```

### 훅 위치

| 훅 | 위치 |
| --- | --- |
| 데이터 조회 훅 (TanStack Query) | `d_features/[domain]/api/useXxx.ts` |
| 상태 훅 (필터·페이지 등) | `d_features/[domain]/model/useXxx.ts` |
| 한 페이지에서만 쓰는 어댑터 (조회 훅을 화면 계약에 맞게 감쌈) | `b_pages/[page]/model/useXxx.ts` |

- `b_pages`의 훅은 `d_features` 훅을 감싸기만 하고 직접 조회하지 않는다.
- 현재 코드와 다른 부분은 [known-gaps](../known-gaps.md)에 있다.

## 배럴 (`index.ts`)

- 슬라이스와 세그먼트는 `index.ts` 배럴로 재노출한다. 소비자는 배럴 경로로 import한다: `import { Shell } from '@shared/ui'`
- 컴포넌트 폴더는 `{Name}/{Name}.tsx` + `index.ts`로 둔다. → [ui-component](../convention/ui-component.md)
- **서버 전용 모듈은 배럴에 넣지 않는다.** 클라이언트 훅 배럴을 통해 브라우저 청크에 섞이는 것을 막기 위해서다. 깊은 경로로 직접 import한다.

```ts
import { newsServerQueries } from '@features/news/api/newsServerQueries';
import { getSeasonInfo } from '@entities/seasonInfo/api/server';
```

## 테스트 위치

테스트는 루트 `test/`에 `src/`와 같은 구조로 둔다. 콜로케이션하지 않는다.

```
src/b_pages/news/utils/getNewsSourceLabel.ts
test/b_pages/news/utils/getNewsSourceLabel.test.ts
```

| 종류 | 위치 |
| --- | --- |
| 공용 fixture | `test/fixtures/` |
| E2E | 미정 (`@playwright/test` 설치만 됨) |

- 미러 규칙과 예외는 [test](../convention/test.md)를 따른다.
