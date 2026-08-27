import { z } from 'zod';
import { DateStringType } from '@shared/model';

const NewsQuerySchema = z.object({
  cursorAt: DateStringType['yyyy-MM-ddTHH:mm'],
  cursorId: z.coerce.number().int().positive(),
  size: z.coerce.number().int().positive(),
});

const NewsDTOSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  link: z.string(),
  originalLink: z.string(),
  publishedAt: z.string(),
});

const NewsListDTOSchema = z.object({
  newsList: z.array(NewsDTOSchema),
  // 실 API는 피드 종료 시 두 필드에 null을 준다(NW-4/H-3, review-NW.md C-2 실측).
  // 값 자체는 이미 newsQueries.ts의 getNextPageParam이 falsy 기준으로 방어하므로
  // 동작은 바뀌지 않는다 — 타입이 실제와 일치하도록 nullable만 추가한다.
  nextCursorAt: DateStringType['yyyy-MM-ddTHH:mm'].nullable(),
  nextCursorId: z.number().nullable(),
});

const RecentNewsDTOSchema = NewsDTOSchema.pick({
  id: true,
  title: true,
  link: true,
});

const RecentNewsListSchema = z.array(RecentNewsDTOSchema);

export {
  NewsQuerySchema,
  NewsDTOSchema,
  NewsListDTOSchema,
  RecentNewsDTOSchema,
  RecentNewsListSchema,
};
