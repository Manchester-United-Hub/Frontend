/**
 * 뉴스 커서 페이지네이션 — 목데이터를 화면에 "전달하는 방식" (#36, 리뷰 #4).
 *
 * 이 파일은 목 데이터(`mockNews`) 자체가 아니라, 목/실 데이터를 커서 단위로 잘라
 * 화면에 넘기는 전달 계층이다. 실제 데이터로 교체될 때 마지막 인덱스(다음 커서)를
 * 구분하는 방식은 서버 계약을 따라 다시 작성된다.
 *
 * `NewsListPage`·`NewsListSource`는 API 데이터 전송 형태를 미러링한 전달 계약이므로
 * UI 타입(`types.ts`)과 분리해 이 전달 계층에 둔다(리뷰 #5).
 */

import { MOCK_NEWS } from './mockNews';
import type { NewsItem, NewsQuery } from './types';

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

/** 최초 조회 커서 — 어떤 기사보다 최신인 경계값(전부 이보다 과거). */
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
