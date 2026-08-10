import { infiniteQueryOptions } from '@tanstack/react-query';

import { getNewsList } from '@entities/news/api/client';
import type { NewsListDTO, NewsQuery } from '@entities/news/model';

import { newsKeys } from './newsKeys';

/** 커서 이동 파라미터 — size는 infiniteList가 페이지 전체에 걸쳐 고정 관리한다. */
type NewsCursorParam = Pick<NewsQuery, 'cursorAt' | 'cursorId'>;

const DEFAULT_NEWS_PAGE_SIZE = 10;

/**
 * 최초 페이지 커서 — 실제로는 존재할 수 없는 "가장 미래" 경계값을 보내
 * "이 커서보다 과거 기사"를 요청하는 실 API 커서 의미를 그대로 활용해 최신 기사부터 조회한다.
 * test/b_pages/news/model/newsFeed.ts(테스트 fixture로 이관, D-10 변경)의 makeInitialNewsQuery와
 * 동일한 관례이나, feature 계층은 상위 레이어(b_pages)는 물론 test/도 import할 수 없어 여기 별도로 둔다.
 *
 * ⚠️ 이 센티널은 **임시 우회**다. 실 API(GET /api/news)는 "cursorAt·cursorId를 둘 다 생략"하는 것이
 * 정식 최초 페이지 호출 방식이지만(Swagger: "둘 다 입력하거나 둘 다 입력하지 않아야 합니다"),
 * BFF 계층의 NewsQuerySchema·app/api/v1/news/route.ts가 세 필드를 모두 필수로 강제해 생략할 수 없다.
 * 스키마·라우트는 이번 스코프(신규 파일 추가만 허용) 밖이므로 후속 과제로 남긴다.
 *
 * cursorAt 값 주의 — 실 서버 검증 결과 `9999-12-31T23:59`은 백엔드에서 500(INTERNAL_SERVER_ERROR)을
 * 유발한다(2999·3000년대는 정상 200). 목데이터 시절 상수를 그대로 올리면 최초 페이지가 항상 실패하므로
 * 백엔드가 수용하는 경계값으로 낮춘다.
 *
 * ⚠️ 이 상수 자체가 임시 우회다(M-4, review-NW.md). test/b_pages/news/model/newsFeed.ts의
 * makeInitialNewsQuery와 값이 이미 divergent하다(여기 2999 vs 그쪽 9999, fixture 전용이라 무해).
 * 근본 해법은 이 상수를 없애는 것 — H-1(NewsQuerySchema optional화)이 완료되면 최초 페이지에서
 * 커서를 생략할 수 있어 이 상수 자체가 사라진다. issues-draft.md Issue 6 참조.
 */
const INITIAL_NEWS_CURSOR: NewsCursorParam = {
  cursorAt: '2999-12-31T23:59',
  cursorId: Number.MAX_SAFE_INTEGER,
};

/**
 * BffApiResponse 언랩 — !success면 throw해 react-query가 isError로 전이시킨다.
 * AD-1 표준 언랩 패턴(D-25) — news는 신규 도메인이라 player list의 언랩-없음 예외 대상이 아니다.
 */
const fetchNewsList = async (query: NewsQuery): Promise<NewsListDTO> => {
  const response = await getNewsList(query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const newsQueries = {
  infiniteList: (pageSize: number = DEFAULT_NEWS_PAGE_SIZE) =>
    infiniteQueryOptions({
      queryKey: newsKeys.infiniteList({ size: pageSize }),
      queryFn: ({ pageParam }: { pageParam: NewsCursorParam }) =>
        fetchNewsList({ ...pageParam, size: pageSize }),
      initialPageParam: INITIAL_NEWS_CURSOR,
      getNextPageParam: (lastPage: NewsListDTO) => {
        // 실 API의 종료 신호는 nextCursorId/nextCursorAt = null이다(실 서버 확인 —
        // 마지막 페이지 다음 호출이 {newsList: [], nextCursorId: null, nextCursorAt: null}).
        // NewsListDTOSchema는 두 필드를 non-nullable로 선언하지만 서버 경로가 런타임 검증 없이
        // `as NewsListDTO` 단언만 하므로 null이 그대로 흘러들어온다 → 값 기준으로 방어한다.
        // 0(기존 목데이터 센티널)도 falsy라 같은 분기로 함께 처리된다.
        if (!lastPage.nextCursorId || !lastPage.nextCursorAt) return undefined;
        // 빈 페이지를 받고도 커서가 남아 있으면 무한 요청이 되므로 함께 종료 조건으로 둔다.
        if (lastPage.newsList.length === 0) return undefined;

        return { cursorAt: lastPage.nextCursorAt, cursorId: lastPage.nextCursorId };
      },
    }),
};

export { newsQueries };
