# 데이터 흐름

## 구성

브라우저는 백엔드를 직접 호출하지 않는다. Next.js Route Handler(`app/bff/v1/*`)가 BFF 역할을 한다.

```
[브라우저] ──clientFetcher──▶ [BFF: app/bff/v1/*] ──serverFetcher──▶ [Spring Boot API]
[Server Component] ──────────────serverFetcher──────────────────────▶ [Spring Boot API]
```

| 호출 주체 | Fetcher | 대상 경로 | 경로 상수 |
| --- | --- | --- | --- |
| 서버 (Server Component, Route Handler, 프리페치) | `serverFetcher` (`API_BASE_URL` 기준) | 백엔드 `/api/...` | `API_PATH` |
| 브라우저 (TanStack Query 훅) | `clientFetcher` (같은 출처) | BFF `/bff/v1/...` | `BFF_PATH` |

- Fetcher와 경로 상수는 `f_shared/api`에 있다. 도메인 코드에서 `fetch`를 직접 호출하지 않는다.
- Fetcher는 네이티브 `fetch` 래퍼다. `AbortController`로 5초(`FETCH_TIMEOUT_MICROSECOND`) 후 요청을 끊는다.
- 경로 문자열은 `API_PATH`·`BFF_PATH`에만 쓴다. 호출부에서 경로를 조립하지 않는다.
- 환경변수는 [env](env.md)를 참고한다.

## 백엔드 응답 형태

- 성공: 공통 래퍼 없이 엔드포인트별 형태로 반환한다.
  - 예: `GET /api/news/recent` → `[{ id, title, link }]`, `GET /api/news` → `{ newsList, nextCursorAt, nextCursorId }`
- 실패: HTTP 상태코드 + `{ code, message }`

## 레이어별 흐름

```
e_entities/[domain]/api/server   serverFetcher 호출 → zod 검증 → ServerApiResult<DTO>
  → app/bff/v1/*/route.ts        쿼리 검증 → toBffResponse() → BffApiResponse<DTO>
  → e_entities/[domain]/api/client  clientFetcher로 BFF 호출 → BffApiResponse<DTO>
  → d_features/[domain]/api      언랩 (실패면 throw) → queryOptions / 훅
  → b_pages · c_widgets          화면용 타입으로 변환 후 렌더
```

### 응답 래퍼 (`f_shared/model/api`)

| 타입 | 위치 | 형태 |
| --- | --- | --- |
| `ServerApiResult<T>` | 서버 함수 반환값 | `{ isSuccess: true, status, data: T }` \| `{ isSuccess: false, status, data: { code, message } }` |
| `BffApiResponse<T>` | BFF 응답 본문 | `{ success: true, data: T, error: null }` \| `{ success: false, data: null, error: { code, message } }` |

- 서버 함수는 실패를 throw하지 않고 `isSuccess: false`로 반환한다.
- Route Handler는 `toBffResponse(result)`로 변환하고, HTTP 상태코드는 `result.status`를 그대로 쓴다.
- 서버 응답 검증은 `toServerApiResult(response, data, schema)`로 처리한다.

### 언랩

`d_features/[domain]/api`의 `queryFn`이 래퍼를 벗긴다. 실패면 `throw`해 TanStack Query가 에러 상태로 전환한다.

```ts
const fetchNewsListViaBff = async (query: NewsQuery): Promise<NewsListDTO> => {
  const response = await getNewsList(query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};
```

- 서버 프리페치용 `queryFn`(`*ServerQueries`)도 같은 방식으로 `ServerApiResult`를 언랩한다. → [query](../convention/query.md)

## 검증 · 변환

| 단계 | 위치 | 이름 |
| --- | --- | --- |
| 백엔드 응답 검증 | `e_entities/[domain]/model/schemas/` | `XxxDTOSchema` |
| BFF 쿼리 검증 | 같은 위치 | `XxxQueryDTOSchema` |
| DTO → 화면용 타입 변환 | `e_entities/[domain]/utils/`, `b_pages/[page]/model/` | `toXxx` |
| 목록에서 일부 고르기 | 같은 위치 | `selectXxx` |

- 스키마는 서버 응답을 **그대로** 검증한다. 실 응답이 `null`을 주는 필드는 `.nullable()`로 선언한다.
- 공통 날짜 문자열 스키마는 `f_shared/model/date.ts`의 `DateStringType`을 쓴다.
- 이름 규칙은 [naming § DTO · 변환 함수](../convention/naming.md#dto--변환-함수)를 따른다.
- 화면 컴포넌트는 변환된 타입을 쓴다. 표현형 공통 컴포넌트(`f_shared/ui`)는 도메인 타입 대신 자체 props로 받는다. → [ui-component](../convention/ui-component.md)

## 에러 처리

| 상황 | 상태 / 코드 | 처리 |
| --- | --- | --- |
| 백엔드 에러 응답 | 백엔드 상태코드 + 백엔드 `code` | 그대로 BFF 응답으로 전달 |
| 백엔드 응답이 스키마와 다름 | `502` / `UPSTREAM_CONTRACT_MISMATCH` | `toServerApiResult`가 실패로 변환 |
| BFF 쿼리·경로 파라미터 오류 | `400` 또는 `422` / `INVALID_QUERY`, `INVALID_SEASON` 등 | 백엔드를 호출하지 않고 거절 |
| 업스트림 호출 실패 (타임아웃 등) | `502` / `SCHEDULE_UNAVAILABLE` 등 | 도메인별 Route Handler에서 처리 |
| 클라이언트 쿼리 실패 | — | 화면별 에러 상태 컴포넌트(`StateBox`, `*ErrorState`) + 재시도 |
| `useSuspenseQuery` 실패 | — | `ErrorBoundary`(`f_shared/ui`) 폴백 → [rendering](rendering.md#로딩--에러) |
| 서버 프리페치 실패 | — | dehydrate에서 제외되고 클라이언트가 이어서 조회한다 |

- 서버 전용 함수가 실패하면 폴백 값을 반환할 수 있다. (예: `getSeasonInfo`는 실패 시 `FALLBACK_SEASON_INFO`)

### BFF 에러 코드

- BFF가 만드는 에러 코드는 `f_shared`의 에러 코드 목록 한 곳에 모은다. Route Handler마다 상수를 따로 선언하지 않는다.
- 코드는 의미를 드러내는 UPPER_SNAKE_CASE 이름으로 쓴다. `'400'`, `'500'` 같은 숫자 문자열을 코드로 쓰지 않는다. (상태는 HTTP 상태코드로 표현한다)

| 코드 | 상태 | 의미 |
| --- | --- | --- |
| `UPSTREAM_CONTRACT_MISMATCH` | 502 | 백엔드 응답이 스키마와 다름 |
| `INVALID_QUERY` | 422 | 쿼리 파라미터가 계약을 벗어남 |
| `INVALID_SEASON` | 422 | `season` 쿼리가 4자리 연도가 아님 |
| `SCHEDULE_UNAVAILABLE` | 502 | 경기 일정 업스트림 호출 실패 |

- 현재 코드와 다른 부분은 [known-gaps](../known-gaps.md)에 있다.
