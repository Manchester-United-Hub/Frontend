import { describe, expect, it } from 'vitest';

import {
  getNewsPage,
  makeInitialNewsQuery,
  NEWS_PAGE_SIZE,
  NO_MORE_CURSOR_ID,
} from '@pages/newsArticle/model';
import type { ArticleItem } from '@pages/newsArticle/model';

const makeItems = (count: number): ArticleItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `t${i + 1}`,
    description: 'd',
    link: 'l',
    originalLink: 'o',
    publishedAt: `2025-01-${String(i + 1).padStart(2, '0')}T00:00`,
  }));

describe('getNewsPage', () => {
  it('최초 페이지를 최신순 size개로 반환하고 다음 커서를 제공한다', () => {
    const page = getNewsPage(makeInitialNewsQuery(2), makeItems(5));
    expect(page.newsList.map((n) => n.id)).toEqual([5, 4]);
    expect(page.nextCursorId).toBe(4);
  });

  it('다음 커서로 이어지는 페이지를 반환한다', () => {
    const list = makeItems(5);
    const first = getNewsPage(makeInitialNewsQuery(2), list);
    const second = getNewsPage(
      { cursorAt: first.nextCursorAt, cursorId: first.nextCursorId, size: 2 },
      list,
    );
    expect(second.newsList.map((n) => n.id)).toEqual([3, 2]);
  });

  it('마지막 페이지는 종료 센티널을 반환한다', () => {
    const list = makeItems(4);
    const first = getNewsPage(makeInitialNewsQuery(2), list);
    const second = getNewsPage(
      { cursorAt: first.nextCursorAt, cursorId: first.nextCursorId, size: 2 },
      list,
    );
    expect(second.newsList.map((n) => n.id)).toEqual([2, 1]);
    expect(second.nextCursorId).toBe(NO_MORE_CURSOR_ID);
  });

  it('빈 목록은 빈 배열과 종료 센티널을 반환한다', () => {
    const page = getNewsPage(makeInitialNewsQuery(2), []);
    expect(page.newsList).toEqual([]);
    expect(page.nextCursorId).toBe(NO_MORE_CURSOR_ID);
  });

  it('기본 목데이터(MOCK_NEWS)를 최신순 한 페이지로 페이지네이션한다', () => {
    const page = getNewsPage(makeInitialNewsQuery());
    expect(page.newsList).toHaveLength(NEWS_PAGE_SIZE);
    expect(page.newsList[0]?.id).toBe(21);
  });
});
