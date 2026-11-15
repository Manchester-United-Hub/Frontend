# 하이라이트 API 연결

- 작성일: 2026-11-02
- 관련 이슈: #51
- 이전 문서: 없음

## 배경 · 목표

- `/highlights`는 실 API가 없어 준비 중 화면(`app/highlights/_components/HighlightsComingSoon`)을 보여주고 있었다. `b_pages/highlights`에는 목데이터 기반 목록 UI가 남아 있다.
- 백엔드에 `GET /api/highlights`가 생겨 목록 UI를 실 데이터에 연결한다.
- 영상은 YouTube 시청 페이지를 새 탭으로 연다. 퍼가기를 막은 영상이 있어 iframe 재생은 보류한다(아래 결정 사항).
- API에 없는 값은 가능한 만큼 다른 필드에서 만들고, 만들 수 없는 값은 UI에서 뺀다.

## 화면 · 컴포넌트 구성

| 레이어 | 위치 | 역할 |
| --- | --- | --- |
| app | `app/highlights/page.tsx` | 현재 시즌 조회(`getSeasonInfo`) → 최신순·조회순 1페이지 prefetch → `HydrationBoundary` → `HighlightsPage`에 `season` 전달 |
| app | `app/bff/v1/highlight/route.ts` | BFF. 쿼리 검증 후 백엔드 호출 |
| b_pages | `b_pages/highlights` | 헤더·정렬 바·대표 영상·그리드·페이저 조합 |
| b_pages | `b_pages/highlights/model/useHighlights.ts` | 정렬·페이지 상태로 `useHighlightList`를 조회하고 DTO → `HighlightItem` 변환, 1페이지 첫 영상을 대표로 분리 |
| b_pages | `b_pages/highlights/ui/HighlightPlayerDialog` | Headless UI `Dialog` + YouTube iframe. **현재 렌더하지 않음** — `embeddable` 필드가 생기면 다시 쓴다 |
| d_features | `d_features/highlight/api` | `highlightKeys`, `highlightListQueryOptions`, `highlightQueries`, `highlightServerQueries`(서버 전용), `useHighlightList` |
| e_entities | `e_entities/highlight` | 스키마·DTO, `api/server`(백엔드), `api/client`(BFF) |

## 데이터

| 항목 | 내용 |
| --- | --- |
| 백엔드 API | `GET /api/highlights?season&sort&page&size` (`season` 필수, `sort`: `LATEST`·`VIEW_COUNT`, `page` 0부터, `size` 1~100) |
| BFF 경로 | `GET /bff/v1/highlight` (`BFF_PATH.highlightList`) |
| schema / DTO | `HighlightListQueryDTOSchema`, `HighlightDTOSchema`, `HighlightListDTOSchema` |
| 조회 방식 | prefetch + HydrationBoundary → 클라이언트 `useQuery` (queryKey: 시즌·정렬·페이지·크기) |
| 캐시 수명 | 5분 (`revalidate 300`, `staleTime 300_000`) |

### 조회 범위

- 정렬·페이지를 서버에 맡긴다. 화면의 정렬·페이지가 바뀔 때마다 `sort`·`page`(0부터)·`size=9`로 조회한다. → [query § 목록 페이지네이션](../../convention/query.md#목록-페이지네이션)
- 페이지 크기 9(3열 그리드 3줄)는 서버 prefetch와 클라이언트 조회가 같은 queryKey를 쓰도록 `d_features/highlight/api/configs.ts`의 `HIGHLIGHT_LIST_PAGE_SIZE` 한 곳에서 정한다.
- 전체 개수·페이지 수는 응답의 `totalElements`·`totalPages`를 그대로 쓴다.
- `page.tsx`에서 최신순·조회순 1페이지를 둘 다 prefetch한다. 정렬 토글은 캐시에서 바로 보이고, 2페이지부터는 누를 때 조회한다.

### 응답 → 화면 매핑

| 화면 값 | 출처 | 처리 |
| --- | --- | --- |
| `id` | `videoId` | 그대로 |
| `title` | `title` | 그대로 |
| `thumbnailUrl` | `thumbnailUrl` | `next/image`. 대부분 R2 호스트지만 일부는 `i.ytimg.com`으로 내려온다(실측) — 두 호스트 모두 `next.config.ts`에 정확히 등록한다 |
| `embedUrl` | `embedUrl` | 재생 모달용(현재 미사용). iframe `src`에 `autoplay=1`을 붙인다 |
| `watchUrl` | `videoId` | `https://www.youtube.com/watch?v={videoId}`. 카드·대표 영상 링크가 새 탭으로 연다 |
| `date` | `publishedAt` | `formatPublishedAt` → `YYYY.MM.DD` |
| `views` | `viewCount` | 축약 표기(`2.6M`, `809.1K`). **0이면 `null`** — 비공개 조회수라 UI에서 숨긴다 |
| 대표 영상 | 현재 정렬 1페이지 응답의 첫 영상 | 나머지 8건이 그리드. 2페이지부터는 대표 없이 응답 9건이 모두 그리드 |
| 대표 영상 라벨 | 현재 정렬 | 최신순 → "최신 영상", 조회순 → "최다 조회" (`FEATURED_LABELS`) |

### UI에서 뺀 값

| 값 | 이유 |
| --- | --- |
| 대회(`competition`) | API에 없음. 제목에 대회명이 들어간 영상이 1건뿐이라 파생 불가 |
| 재생 시간(`duration`) | API에 없음. YouTube Data API 호출이 필요해 범위 밖 |
| 대표 영상 설명(`description`) | API에 없음 |
| 카테고리(골·선방, 영상 유형 등) | API에 분류 필드도 필터 조건도 없음. 제목 문구로 나누는 방식은 제목 형식이 바뀌면 깨져서 쓰지 않는다 |

## 상태

| 값 | 위치 (useState / 커스텀 훅 / Context) |
| --- | --- |
| 하이라이트 목록 | TanStack Query (`useHighlightList`) |
| 정렬·페이지 | 커스텀 훅 `useHighlights` (`b_pages/highlights/model`) |

## 테스트 계획

| 대상 | 검증할 것 |
| --- | --- |
| `fetchHighlightList` (server) | 경로·쿼리, 성공, 스키마 불일치 502, 백엔드 에러 전달 |
| `getHighlightList` (client) | BFF 경로·쿼리 |
| BFF route | 정상 호출, `season` 누락·범위 밖 `size` → 422 |
| `highlightQueries` · `highlightServerQueries` | 같은 queryKey·staleTime, 정렬·페이지별 queryKey, 언랩·실패 시 throw |
| `toHighlightItem` | 필드 매핑, 조회수 0 → `null` |
| `useHighlights` | 조회 쿼리(정렬·0부터 페이지·크기), 1페이지 대표 분리, 2페이지 대표 없음, 정렬 변경 시 1페이지로 리셋, 로딩·에러 |
| UI | 카드·대표 영상의 조회수 유무, 대표 영상 정렬 라벨, YouTube 시청 링크(href·새 탭·rel), 페이지 변경 시 맨 위 스크롤, 에러·빈 상태 |
| `app/highlights/page` | 두 정렬 prefetch 후 초기 렌더·정렬 전환 모두 클라이언트 조회 없음, 실패 시 클라이언트가 이어받음 |

## 결정 사항

- 카테고리 필터와 배지를 없앤다 — API에 분류 기준이 없다. 처음엔 제목 문구로 영상 유형(하이라이트·확장 하이라이트·풀매치)을 나눴지만 API 조회 조건에 없는 값이라 지운다.
- 대표 영상은 현재 정렬 1페이지의 첫 영상이다 — 정렬 토글을 누르면 화면에서 가장 큰 요소가 바로 바뀌어 정렬이 바뀐 것을 알 수 있다(처음 구현은 대표 영상이 항상 최신 영상이라 조회순으로 바꿔도 그리드만 바뀌어 변화가 잘 보이지 않았다). 2페이지부터는 대표 없이 그리드만 보여 서버 페이지와 화면이 1:1로 맞는다.
- 페이지를 바꾸면 페이지 맨 위로 스크롤한다 — 페이저가 목록 맨 아래에 있어 그대로 두면 바뀐 목록의 끝부터 보인다.
- 재생은 YouTube 시청 페이지를 새 탭으로 여는 방식으로 한다 — 2026 시즌 40건 중 18건이 퍼가기 비허용·비공개라 iframe으로 재생되지 않는다(oEmbed 401·403, 2026-11-15 실측). API에 퍼가기 허용 여부가 없어 어떤 영상이 막혔는지 미리 알 수 없으므로 전부 외부 링크로 보낸다.
- 카드·대표 영상은 `<a target="_blank" rel="noopener noreferrer">`로 둔다. 새 탭으로 열린다는 안내는 카드에서 `aria-describedby`(제목 heading 이름을 오염시키지 않도록), 대표 영상 재생 링크에서 `aria-label`로 전달하고, 화면에는 `SquareArrowOutUpRight` 아이콘을 둔다(Navbar 외부 링크와 같은 아이콘). → [accessibility](../../convention/accessibility.md#aria)
- 재생 모달(`HighlightPlayerDialog`)은 지우지 않고 렌더만 하지 않는다 — 퍼가기 허용 여부가 생기면 허용 영상은 모달, 비허용 영상은 외부 링크로 나눈다.
- 준비 중 화면(`HighlightsComingSoon`)과 목데이터(`mockHighlights`)를 지운다. ([known-gaps](../../known-gaps.md) 4번 해소)

## 미해결

- 2페이지부터는 prefetch가 없어 처음 누를 때 스켈레톤이 잠깐 보인다(정렬 바·페이저까지 스켈레톤으로 바뀐다). 거슬리면 다음 페이지 미리 받기나 이전 데이터 유지(`placeholderData`)를 검토한다.
- 시즌 선택 UI는 없다. 현재 시즌만 보여준다.
- 백엔드 응답에 퍼가기 허용 여부(YouTube Data API `status.embeddable`)와 공개 상태(`status.privacyStatus`)를 추가 요청한다(후순위). 받으면 허용 영상만 모달로 재생하고, 볼 수 없는 영상(비공개)은 목록에서 뺄지 정한다.
- 조회수 0을 "조회수 비공개"로 보고 숨기는데, 실측상 조회수 0 영상 일부가 비공개·제한 영상(oEmbed 403)이었다. 공개 상태 필드가 생기면 함께 다시 본다.
