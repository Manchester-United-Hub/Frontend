import z from 'zod';
import { DateStringType } from '@shared/model';

const MIN_PAGE_NUMBER = 0;
const MIN_PAGE_SIZE = 1;
const MAX_HIGHLIGHT_PAGE_SIZE = 100;

const HIGHLIGHT_SORT_KEYS = ['LATEST', 'VIEW_COUNT'] as const;

const HighlightListQueryDTOSchema = z.object({
  season: z.number().int().positive(),
  sort: z.enum(HIGHLIGHT_SORT_KEYS).optional(),
  page: z.number().int().min(MIN_PAGE_NUMBER).optional(),
  size: z.number().int().min(MIN_PAGE_SIZE).max(MAX_HIGHLIGHT_PAGE_SIZE).optional(),
});

// YouTube에서 조회수를 비공개로 설정한 영상은 viewCount가 0으로 내려온다.
const HighlightDTOSchema = z.object({
  videoId: z.string(),
  title: z.string(),
  thumbnailUrl: z.string(),
  embedUrl: z.string(),
  publishedAt: DateStringType['yyyy-MM-ddTHH:mm:ss'],
  viewCount: z.number().int().nonnegative(),
});

const HighlightListDTOSchema = z.object({
  season: z.number().int(),
  highlights: z.array(HighlightDTOSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  hasNext: z.boolean(),
});

export {
  MAX_HIGHLIGHT_PAGE_SIZE,
  HighlightListQueryDTOSchema,
  HighlightDTOSchema,
  HighlightListDTOSchema,
};
