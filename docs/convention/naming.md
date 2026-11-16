# 네이밍

## 기본

- 축약하지 않고 의도를 드러내는 이름을 쓴다: `userAge`, `totalPrice`
- 함수는 동작이므로 동사형으로 짓는다: `getUser`, `calculateTotal`

## 파일

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 컴포넌트 파일 | PascalCase, 폴더 이름과 같게 | `MatchCard/MatchCard.tsx` |
| 그 외 파일 (훅, 함수, 스키마 등) | camelCase | `useNewsFeed.ts`, `toMatchItem.ts` |
| 타입 파일 | `types.ts` | `model/types.ts` |
| 상수 파일 | `configs.ts` | `model/configs.ts` |
| 배럴 | `index.ts` | |
| Next.js 특수 파일 | 프레임워크 규칙 그대로 | `page.tsx`, `layout.tsx`, `not-found.tsx`, `route.ts` |

## 폴더

- 슬라이스·세그먼트 폴더는 camelCase: `b_pages/playerDetail`, `d_features/seasonInfo`
- 컴포넌트 폴더는 PascalCase: `ui/NewsRow/`
- 레이어 폴더(`b_pages` 등)는 [folder-structure](../architecture/folder-structure.md#레이어) 규칙을 따른다.

## 상수 · 타입

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 모듈 상수 | UPPER_SNAKE_CASE | `NAV_ITEMS`, `DEFAULT_NEWS_PAGE_SIZE` |
| 시간 상수 | 단위를 접미사로 | `NEWS_LIST_STALE_TIME_MS` |
| 타입 | PascalCase | `NewsItem`, `ButtonProps` |
| 컴포넌트 props | `컴포넌트명Props` | `PlayerDetailPageProps` |

## DTO · 변환 함수

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| 백엔드 응답 타입 | `DTO` 접미사 (대문자) | `NewsListDTO`, `PlayerDTO` |
| 요청 파라미터 타입 | `QueryDTO` 접미사 | `PlayerListQueryDTO` |
| zod 스키마 | 타입 이름 + `Schema` | `NewsListDTOSchema` |
| 변환 함수 (DTO → 화면용 타입) | `to` + 결과 타입 | `toMatchItem`, `toSeasonInfo` |
| 목록에서 일부 고르기 | `select` + 대상 | `selectSquadPreview`, `selectSeasonRows` |

- `Dto`(소문자), `DAO`, `convertXxx2Yyy`, `mapXxxToYyy` 형태는 쓰지 않는다.

## 쿼리

| 대상 | 규칙 | 예 |
| --- | --- | --- |
| query key 팩토리 | `[domain]Keys` | `newsKeys` |
| 클라이언트 queryOptions | `[domain]Queries` | `newsQueries` |
| 서버 prefetch queryOptions | `[domain]ServerQueries` | `newsServerQueries` |
| BFF 호출 언랩 함수 | `fetchXxxViaBff` | `fetchNewsListViaBff` |
| 서버 언랩 함수 | `fetchXxxOnServer` | `fetchNewsListOnServer` |

자세한 작성법은 [query](query.md).

## 이벤트 · boolean

- props로 받는 콜백: `on` + 동작 → `onSelect`, `onFetchNextPage`
- 컴포넌트 안에서 정의한 처리 함수: `handle` + 동작 → `handleSelect`
- boolean은 `is`·`has`·`can` 접두사를 쓴다: `isLoading`, `hasNextPage`, `isOuterLink`

## import

- 다른 레이어는 경로 별칭으로 import한다: `@shared/ui`, `@entities/news/model`
- 같은 슬라이스 안은 상대경로로 import한다.

현재 코드와 다른 부분은 [known-gaps](../known-gaps.md)에 있다.
