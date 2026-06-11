import { z } from 'zod';
import {
  NewsQuerySchema,
  NewsDTOSchema,
  NewsListDTOSchema,
  RecentNewsDTOSchema,
  RecentNewsListSchema,
} from './schemas';

type NewsQuery = z.infer<typeof NewsQuerySchema>;
type NewsDTO = z.infer<typeof NewsDTOSchema>;
type NewsListDTO = z.infer<typeof NewsListDTOSchema>;
type RecentNewsDTO = z.infer<typeof RecentNewsDTOSchema>;
type RecentNewsListDTO = z.infer<typeof RecentNewsListSchema>;

export type { NewsQuery, NewsDTO, NewsListDTO, RecentNewsDTO, RecentNewsListDTO };
