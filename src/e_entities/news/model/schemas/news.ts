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
  nextCursorAt: DateStringType['yyyy-MM-ddTHH:mm'],
  nextCursorId: z.number(),
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
