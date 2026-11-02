# TanStack Query

서버 prefetch → `HydrationBoundary` 흐름은 [rendering § 서버 데이터 조회 방식](../architecture/rendering.md#서버-데이터-조회-방식) 참고.

## 파일 구성

도메인별로 `d_features/[domain]/api/`에 둔다.

| 파일 | 역할 | 배럴 노출 |
| --- | --- | --- |
| `[domain]Keys.ts` | query key 팩토리 | O |
| `[domain]Queries.ts` | 클라이언트 `queryOptions` (BFF 호출) | O |
| `[domain]ServerQueries.ts` | 서버 prefetch용 `queryOptions` (백엔드 직접 호출) | **X** (서버 전용) |
| `useXxx.ts` | `useQuery` / `useInfiniteQuery` / `useSuspenseQuery` 훅 | O |
| `configs.ts` | `staleTime` 등 상수 | — |

## query key

- 키의 첫 요소는 도메인 이름이다: `['news']`, `['player']`, `['matches']`
- 하위 키는 `all`을 펼쳐 만든다.
- 호출부에서 `queryKey`를 조립하지 않는다. 항상 `[domain]Keys`를 쓴다.

```ts
const playerKeys = {
  all: ['player'] as const,
  list: (query: PlayerListQueryDTO) => [...playerKeys.all, 'list', query] as const,
  profile: (playerId: number, season: number) =>
    [...playerKeys.all, 'profile', playerId, season] as const,
};
```

## 서버 / 클라이언트 쿼리 공유

- `[domain]Queries`와 `[domain]ServerQueries`는 **같은 `queryKey`·`staleTime`**을 써야 한다. 다르면 hydrate된 데이터를 클라이언트가 재사용하지 못한다.
- 둘이 다른 것은 `queryFn`뿐이다. 공통 옵션은 팩토리 하나에 두고 `queryFn`만 주입한다.

```ts
const newsInfiniteQueryOptions = (fetchPage: NewsPageFetcher, pageSize = DEFAULT_NEWS_PAGE_SIZE) =>
  infiniteQueryOptions({
    queryKey: newsKeys.infiniteList({ size: pageSize }),
    queryFn: ({ pageParam }) => fetchPage({ ...pageParam, size: pageSize }),
    initialPageParam: INITIAL_NEWS_CURSOR,
    getNextPageParam: getNextNewsPageParam,
    staleTime: NEWS_LIST_STALE_TIME_MS,
  });

const newsQueries = { infiniteList: (size?: number) => newsInfiniteQueryOptions(fetchNewsListViaBff, size) };
const newsServerQueries = { infiniteList: (size?: number) => newsInfiniteQueryOptions(fetchNewsListOnServer, size) };
```

## queryFn 언랩

- `queryFn`은 응답 래퍼를 벗겨 데이터만 반환한다. 실패면 `throw`한다. → [data-flow § 언랩](../architecture/data-flow.md#언랩)

## staleTime

- `staleTime`은 도메인별 캐시 수명표를 따른다. → [rendering § 캐시](../architecture/rendering.md#캐시)
- 값은 `configs.ts`에 `XXX_STALE_TIME_MS` 상수로 둔다.

## 목록 페이지네이션

| 목록 | API 방식 | UI | 훅 |
| --- | --- | --- | --- |
| 뉴스 | 커서 (`cursorAt`, `cursorId`, `size`) | 더보기 버튼 | `useInfiniteQuery` |
| 선수 | 전체 스쿼드를 한 번에 조회 | 클라이언트에서 필터·페이지 분할 | `useQuery` + `usePlayerListFilters` |

- 뉴스의 다음 커서는 응답의 `nextCursorAt`, `nextCursorId`를 쓴다. 둘 중 하나가 `null`이거나 빈 페이지면 끝이다.
- 선수 목록은 필터·검색이 전체 스쿼드를 대상으로 하므로 서버 페이징을 쓰지 않는다.

## Suspense

- `useSuspenseQuery`를 쓰는 블록은 `Suspense` + `ErrorBoundary`로 감싼다. 재시도 시 `useQueryErrorResetBoundary().reset`을 `onReset`에 넘긴다.
