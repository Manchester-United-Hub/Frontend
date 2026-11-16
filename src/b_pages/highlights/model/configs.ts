import type { HighlightSortKey } from './types';

const DEFAULT_SORT_KEY: HighlightSortKey = 'LATEST';

const FEATURED_LABELS: Record<HighlightSortKey, string> = {
  LATEST: '최신 영상',
  VIEW_COUNT: '최다 조회',
};

export { DEFAULT_SORT_KEY, FEATURED_LABELS };
