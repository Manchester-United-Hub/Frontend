/**
 * 뉴스 커서 페이지네이션 — 테스트 fixture (#36, 리뷰 #4, 이관: 사용자 지시로 D-10 변경).
 *
 * 이 파일은 목 데이터(`mockNews`) 자체가 아니라, 목/실 데이터를 커서 단위로 잘라
 * 화면에 넘기는 전달 계층이다. 실제 데이터로 교체될 때 마지막 인덱스(다음 커서)를
 * 구분하는 방식은 서버 계약을 따라 다시 작성된다.
 *
 * `NewsListPage`·`NewsListSource`는 API 데이터 전송 형태를 미러링한 전달 계약이므로
 * 프로덕션 UI 타입(`src/b_pages/news/model/types.ts`)과 분리해 이 전달 계층에 둔다(리뷰 #5).
 *
 * **테스트 fixture 전용 (NW-3/D-9/D-10)**: `useNewsFeed`가 react-query 기반
 * `useNewsInfiniteList`(d_features/news) 어댑터로 교체되면서 production import 경로에서
 * 제거됐다. production 사용처가 전혀 없어 `src/b_pages/news/model/`에서
 * `test/b_pages/news/model/` 아래로 이관했다 — 기존 D-10("삭제·이동 없이 fixture 주석만")과
 * 달리 이번엔 실제 이동이다. `getNewsPage`는 같은 디렉터리의 `getNewsPage.test.ts`가 순수
 * 페이지네이션 로직 검증용으로만 계속 사용한다.
 *
 * `NewsItem`·`NewsQuery`는 프로덕션 타입이므로 `src`에 그대로 두고 `@pages/news/model`에서
 * 가져온다.
 */

import { MOCK_NEWS } from './mockNews';
import type { NewsItem, NewsQuery } from '@pages/news/model';

/** 한 페이지 기사 수. */
export const NEWS_PAGE_SIZE = 9;

/** "더 이상 없음" 커서 센티널 — 실제 id는 양수이므로 0을 종료 신호로 쓴다. */
export const NO_MORE_CURSOR_ID = 0;

/** 커서 페이지 응답 — 실제 NewsListDTO 형태(newsList/nextCursor…)를 미러링. */
export interface NewsListPage {
  newsList: NewsItem[];
  nextCursorAt: string;
  nextCursorId: number;
}

/** 페이지 소스 — 목/실 데이터 교체 지점. 테스트는 여기에 fixture를 주입한다. */
export type NewsListSource = (query: NewsQuery) => NewsListPage;

/**
 * 최초 조회 커서 — 어떤 기사보다 최신인 경계값(전부 이보다 과거).
 *
 * 주의: `cursorAt='9999-...'`는 실 API에서 500을 유발한다(C-1, review-NW.md).
 * 이 파일은 fixture 전용이라 무해하지만, 프로덕션 코드(d_features/news/api/newsQueries.ts의
 * INITIAL_NEWS_CURSOR)로 이 값을 재승격 금지 — 근본 해법은 issues-draft.md Issue 6 참조(H-1).
 */
export const makeInitialNewsQuery = (size: number = NEWS_PAGE_SIZE): NewsQuery => ({
  cursorAt: '9999-12-31T23:59',
  cursorId: Number.MAX_SAFE_INTEGER,
  size,
});

/** 최신순 정렬 비교자 — publishedAt 내림차순, 동시각은 id 내림차순. */
const compareNewestFirst = (
  a: { publishedAt: string; id: number },
  b: { publishedAt: string; id: number },
): number => {
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return b.id - a.id;
};

/** 커서보다 과거(피드에서 더 아래)인 기사인가. */
const isOlderThanCursor = (item: NewsItem, query: NewsQuery): boolean =>
  compareNewestFirst({ publishedAt: query.cursorAt, id: query.cursorId }, item) < 0;

/**
 * 커서 이후 size개를 최신순으로 반환. 남은 게 더 있으면 마지막 아이템을 다음 커서로,
 * 없으면 nextCursorId를 센티널(0)로 설정한다.
 */
export const getNewsPage = (query: NewsQuery, list: NewsItem[] = MOCK_NEWS): NewsListPage => {
  const remaining = [...list].sort(compareNewestFirst).filter((n) => isOlderThanCursor(n, query));
  const newsList = remaining.slice(0, query.size);
  const last = newsList.at(-1);
  const hasMore = remaining.length > query.size;

  return {
    newsList,
    nextCursorAt: last ? last.publishedAt : query.cursorAt,
    nextCursorId: hasMore && last ? last.id : NO_MORE_CURSOR_ID,
  };
};
