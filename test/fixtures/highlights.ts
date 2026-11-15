import type { HighlightDTO, HighlightListDTO } from '@entities/highlight/model';
import type { HighlightItem } from '@pages/highlights/model';

type HighlightListMeta = Omit<HighlightListDTO, 'highlights'>;

const buildHighlightDTO = (overrides: Partial<HighlightDTO> = {}): HighlightDTO => ({
  videoId: 'wwFPqhC51oY',
  title: 'Man Utd 0-3 Bournemouth | Highlights',
  thumbnailUrl: 'https://pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev/highlights/wwFPqhC51oY.png',
  embedUrl: 'https://www.youtube.com/embed/wwFPqhC51oY',
  publishedAt: '2026-10-25T17:19:20',
  viewCount: 809063,
  ...overrides,
});

const buildHighlightListDTO = (
  highlights: HighlightDTO[],
  meta: Partial<HighlightListMeta> = {}
): HighlightListDTO => ({
  season: 2026,
  highlights,
  page: 0,
  size: 9,
  totalElements: highlights.length,
  totalPages: 1,
  hasNext: false,
  ...meta,
});

const buildHighlightItem = (overrides: Partial<HighlightItem> = {}): HighlightItem => ({
  id: 'h0',
  title: '테스트 영상 | Highlights',
  thumbnailUrl: 'https://pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev/highlights/h0.png',
  embedUrl: 'https://www.youtube.com/embed/h0',
  watchUrl: 'https://www.youtube.com/watch?v=h0',
  date: '2026.10.01',
  views: '1M',
  ...overrides,
});

export { buildHighlightDTO, buildHighlightListDTO, buildHighlightItem };
