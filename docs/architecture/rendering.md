# 렌더링

> Next.js API는 `node_modules/next/dist/docs/`를 기준으로 확인한다.

## Server / Client 경계

- 기본은 Server Component다.
- `'use client'`는 아래 트리거에 해당할 때만 붙이고, 컴포넌트 트리의 가능한 한 말단에 둔다.

### 'use client' 허용 트리거

| 트리거 | 예 |
| --- | --- |
| React 상태·생명주기 훅 | `useState`, `useEffect` |
| 이벤트 핸들러 | `onClick`, `onChange` |
| 브라우저 전용 API | `window`, `matchMedia` |
| 클라이언트 전용 훅·라이브러리 | TanStack Query 훅, Headless UI |
| 에러 경계 | `ErrorBoundary` (클래스 컴포넌트) |

- 서버 전용 모듈(`api/server`, `*ServerQueries`, `'use cache'` 함수)은 클라이언트 모듈에서 import하지 않는다. 배럴에도 넣지 않는다. → [folder-structure § 배럴](folder-structure.md#배럴-indexts)

## 서버 데이터 조회 방식

페이지 성격에 따라 아래 표에서 고른다.

| 데이터 성격 | 방식 | 예 |
| --- | --- | --- |
| 목록·페이지네이션·더보기 (클라이언트에서 이어서 조회) | 서버 prefetch → `HydrationBoundary` → 클라이언트 `useQuery` / `useInfiniteQuery` | 랜딩, 뉴스, 선수 목록 |
| 사용자 입력 없이 서버에서 끝나는 패널 | Server Component에서 `'use cache'` 함수를 직접 호출 + `Suspense` | 시즌 (요약·일정·순위) |

### 서버 prefetch + HydrationBoundary

```
page.tsx: new QueryClient({ retry: false }) → prefetchQuery(xxxServerQueries...) → dehydrate
  └─ <HydrationBoundary> → b_pages / Client Component: useQuery(xxxQueries...)
```

- prefetch 전용 `QueryClient`는 `retry: false`로 만든다. 백엔드 장애 시 재시도로 응답을 늦추지 않는다.
- prefetch가 실패하면 dehydrate에서 빠지고, 클라이언트가 BFF로 이어서 조회한다.
- 서버/클라이언트 쿼리는 같은 query key를 써야 한다. → [query](../convention/query.md)

## 캐시

캐시 수명은 도메인별로 아래 표 한 곳에서 정한다. 라우트 `revalidate`, `cacheLife`, `staleTime`은 이 표의 값을 따른다.

| 도메인 | 수명 | 라우트 `revalidate` | `cacheLife` | `staleTime` |
| --- | --- | --- | --- | --- |
| matches (랜딩) | 5분 | `300` | — | `300_000` |
| news | 5분 / 1분 | `300` | — | `60_000` |
| player (목록) | 1시간 | `3600` | `'hours'` | `3_600_000` |
| seasonInfo | 1시간 | — | `'hours'` | — |
| rank | 1시간 / 1분 | `60` (BFF) | `'hours'` | — |
| matches (시즌 일정) | 캐시 없음 (매 요청) | — | — | — |

- `'use cache'`는 `next.config.ts`의 `experimental.useCache`로 켠다.
- `cacheLife` 프로파일은 Next 내장 이름만 쓴다. 이름은 `e_entities/seasonInfo/configs`의 `BuiltinCacheProfile` 타입으로 검사한다.
- 같은 도메인의 세 값이 서로 다른 수명을 가리키면 SSR 데이터와 클라이언트 캐시가 서로를 무효화한다. 값을 바꿀 때는 이 표와 세 곳을 함께 바꾼다.
- news·rank처럼 표에 수명이 두 개인 행은 값이 아직 통일되지 않은 것이다. → [known-gaps](../known-gaps.md)

### 'use cache' 함수 작성

- 캐시 함수는 실패를 throw하지 않고 값(`{ ok: false }`)으로 반환한다.
- 캐시된 실패가 사용자에게 고정되지 않도록, 캐시 밖에서 한 번 더 조회하는 복구 경로를 둔다. 그래도 실패하면 폴백 값을 쓴다. (예: `getSeasonInfo`)
- 요청 단위 중복 호출은 React `cache()`로 감싸 막는다.

## 로딩 · 에러

| 범위 | 처리 |
| --- | --- |
| 데이터를 불러오는 블록 | `Suspense` + 블록 모양 스켈레톤 (`*Skeleton`) |
| `useSuspenseQuery` 실패 | `ErrorBoundary` (`f_shared/ui`) 폴백 + 재시도 |
| `useQuery` 실패 | 화면별 에러 상태 (`StateBox`, `*ErrorState`) |
| 라우트 전체 로딩 | `loading.tsx` (예: `players/[playerId]`) |
| 존재하지 않는 경로 | `not-found.tsx` → `NotFoundPage` |
| 라우트 전체 실패 (`error.tsx`) | 미정 |
