import { infiniteQueryOptions } from '@tanstack/react-query';

import type { NewsListDTO, NewsQuery } from '@entities/news/model';

import { newsKeys } from './newsKeys';

/** 커서 이동 파라미터 — size는 infiniteList가 페이지 전체에 걸쳐 고정 관리한다. */
type NewsCursorParam = Pick<NewsQuery, 'cursorAt' | 'cursorId'>;

/** 서버/클라이언트가 각자 주입하는 페이지 페처 — 언랩까지 끝낸 NewsListDTO를 반환해야 한다. */
type NewsPageFetcher = (query: NewsQuery) => Promise<NewsListDTO>;

const DEFAULT_NEWS_PAGE_SIZE = 10;

/** hydration 직후 즉시 refetch를 막는 신선도 창(AD-3) — 서버/클라이언트가 이 값을 공유해야 한다. */
const NEWS_LIST_STALE_TIME_MS = 60_000;

/**
 * 최초 페이지 커서 — 실제로는 존재할 수 없는 "가장 미래" 경계값을 보내
 * "이 커서보다 과거 기사"를 요청하는 실 API 커서 의미를 그대로 활용해 최신 기사부터 조회한다.
 * test/b_pages/news/model/newsFeed.ts(테스트 fixture)의 makeInitialNewsQuery와 동일한 관례이나,
 * feature 계층은 상위 레이어(b_pages)는 물론 test/도 import할 수 없어 여기 별도로 둔다.
 *
 * ⚠️ 이 센티널은 **임시 우회**다. 실 API(GET /api/news)는 "cursorAt·cursorId를 둘 다 생략"하는 것이
 * 정식 최초 페이지 호출 방식이지만(Swagger: "둘 다 입력하거나 둘 다 입력하지 않아야 합니다"),
 * BFF 계층의 NewsQuerySchema·app/api/v1/news/route.ts가 세 필드를 모두 필수로 강제해 생략할 수 없다.
 * **서버 프리페치 경로도 클라이언트 refetch와 같은 값을 써야 한다** — 서버만 커서를 생략하면
 * hydration된 pageParams[0]과 클라이언트 initialPageParam이 어긋난다(AD-7).
 *
 * cursorAt 값 주의 — 실 서버 검증 결과 `9999-12-31T23:59`은 백엔드에서 500(INTERNAL_SERVER_ERROR)을
 * 유발한다(2999·3000년대는 정상 200). 목데이터 시절 상수를 그대로 올리면 최초 페이지가 항상 실패하므로
 * 백엔드가 수용하는 경계값으로 낮춘다.
 *
 * 근본 해법은 이 상수를 없애는 것 — H-1(NewsQuerySchema optional화)이 완료되면 최초 페이지에서
 * 커서를 생략할 수 있어 이 상수 자체가 사라진다. issues-draft.md Issue 7 참조.
 */
const INITIAL_NEWS_CURSOR: NewsCursorParam = {
  cursorAt: '2999-12-31T23:59',
  cursorId: Number.MAX_SAFE_INTEGER,
};

/**
 * 실 API의 종료 신호는 nextCursorId/nextCursorAt = null이다(실 서버 확인 —
 * 마지막 페이지 다음 호출이 {newsList: [], nextCursorId: null, nextCursorAt: null}).
 * NewsListDTOSchema는 두 필드를 nullable로 선언하므로(NW-4) 이 null은 스키마 검증을 통과해
 * 그대로 들어온다 — falsy 값 기준으로 방어한다. 0(기존 목데이터 센티널)도 falsy라 같은 분기로 함께 처리된다.
 */
const getNextNewsPageParam = (lastPage: NewsListDTO): NewsCursorParam | undefined => {
  if (!lastPage.nextCursorId || !lastPage.nextCursorAt) return undefined;
  // 빈 페이지를 받고도 커서가 남아 있으면 무한 요청이 되므로 함께 종료 조건으로 둔다.
  if (lastPage.newsList.length === 0) return undefined;

  return { cursorAt: lastPage.nextCursorAt, cursorId: lastPage.nextCursorId };
};

/**
 * 뉴스 무한목록 쿼리 옵션 팩토리 — queryKey·initialPageParam·getNextPageParam·staleTime의
 * 유일한 소유자다(AD-2). 서버/클라이언트 모듈은 queryFn(fetchPage)만 주입한다.
 */
const newsInfiniteQueryOptions = (
  fetchPage: NewsPageFetcher,
  pageSize: number = DEFAULT_NEWS_PAGE_SIZE
) =>
  infiniteQueryOptions({
    queryKey: newsKeys.infiniteList({ size: pageSize }),
    queryFn: ({ pageParam }: { pageParam: NewsCursorParam }) =>
      fetchPage({ ...pageParam, size: pageSize }),
    initialPageParam: INITIAL_NEWS_CURSOR,
    getNextPageParam: getNextNewsPageParam,
    staleTime: NEWS_LIST_STALE_TIME_MS,
  });

export { newsInfiniteQueryOptions, DEFAULT_NEWS_PAGE_SIZE };
export type { NewsPageFetcher };
