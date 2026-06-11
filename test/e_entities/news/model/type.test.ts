import { describe, it, expect } from 'vitest';
import {
  NewsQuerySchema,
  NewsDTOSchema,
  NewsListDTOSchema,
  RecentNewsDTOSchema,
  RecentNewsListSchema,
} from '@entities/news/model';

const validNewsQuery = {
  cursorAt: '2024-01-15T20:00',
  cursorId: 1,
  size: 10,
};

const validNews = {
  id: 1,
  title: '맨유 경기 리뷰',
  description: '어제 경기 리뷰입니다.',
  link: 'https://example.com/news/1',
  originalLink: 'https://original.com/news/1',
  publishedAt: '2024-01-15T20:00:00',
};

describe('NewsQuerySchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(NewsQuerySchema.safeParse(validNewsQuery).success).toBe(true);
  });
  it('size가 없으면 실패한다', () => {
    const { size: _, ...rest } = validNewsQuery;
    expect(NewsQuerySchema.safeParse(rest).success).toBe(false);
  });
});

describe('NewsDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(NewsDTOSchema.safeParse(validNews).success).toBe(true);
  });
  it('id가 없으면 실패한다', () => {
    const { id: _, ...rest } = validNews;
    expect(NewsDTOSchema.safeParse(rest).success).toBe(false);
  });
  it('title이 없으면 실패한다', () => {
    const { title: _, ...rest } = validNews;
    expect(NewsDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('NewsListDTOSchema', () => {
  it('뉴스 목록과 커서가 있으면 통과한다', () => {
    const data = {
      newsList: [validNews],
      nextCursorAt: '2024-01-15T20:00',
      nextCursorId: 2,
    };
    expect(NewsListDTOSchema.safeParse(data).success).toBe(true);
  });
  it('빈 뉴스 목록이면 통과한다', () => {
    const data = {
      newsList: [],
      nextCursorAt: '2024-01-15T20:00',
      nextCursorId: 0,
    };
    expect(NewsListDTOSchema.safeParse(data).success).toBe(true);
  });
  it('nextCursorId가 없으면 실패한다', () => {
    const data = { newsList: [], nextCursorAt: '2024-01-15T20:00' };
    expect(NewsListDTOSchema.safeParse(data).success).toBe(false);
  });
});

describe('RecentNewsDTOSchema', () => {
  it('id, title, link가 있으면 통과한다', () => {
    const recent = { id: 1, title: '제목', link: 'https://example.com' };
    expect(RecentNewsDTOSchema.safeParse(recent).success).toBe(true);
  });
  it('link가 없으면 실패한다', () => {
    const recent = { id: 1, title: '제목' };
    expect(RecentNewsDTOSchema.safeParse(recent).success).toBe(false);
  });
});

describe('RecentNewsListSchema', () => {
  it('RecentNewsDTO 배열이면 통과한다', () => {
    const list = [{ id: 1, title: '제목', link: 'https://example.com' }];
    expect(RecentNewsListSchema.safeParse(list).success).toBe(true);
  });
  it('빈 배열이면 통과한다', () => {
    expect(RecentNewsListSchema.safeParse([]).success).toBe(true);
  });
});
