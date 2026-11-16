import { queryOptions } from '@tanstack/react-query';

import type {
  HighlightListDTO,
  HighlightListQueryDTO,
  HighlightListSort,
} from '@entities/highlight/model';

import { HIGHLIGHT_LIST_PAGE_SIZE, HIGHLIGHT_LIST_STALE_TIME_MS } from './configs';
import { highlightKeys } from './highlightKeys';

type HighlightListFetcher = (query: HighlightListQueryDTO) => Promise<HighlightListDTO>;

interface HighlightListParams {
  season: number;
  sort: HighlightListSort;
  page: number;
}

const highlightListQueryOptions = (
  fetchList: HighlightListFetcher,
  params: HighlightListParams
) => {
  const query: HighlightListQueryDTO = { ...params, size: HIGHLIGHT_LIST_PAGE_SIZE };

  return queryOptions({
    queryKey: highlightKeys.list(query),
    queryFn: () => fetchList(query),
    staleTime: HIGHLIGHT_LIST_STALE_TIME_MS,
  });
};

export { highlightListQueryOptions };
export type { HighlightListFetcher, HighlightListParams };
