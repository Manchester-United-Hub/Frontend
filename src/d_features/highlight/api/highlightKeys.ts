import type { HighlightListQueryDTO } from '@entities/highlight/model';

const highlightKeys = {
  all: ['highlight'] as const,
  list: (query: HighlightListQueryDTO) => [...highlightKeys.all, 'list', query] as const,
};

export { highlightKeys };
