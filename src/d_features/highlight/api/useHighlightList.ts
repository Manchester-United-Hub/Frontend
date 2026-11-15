import { useQuery } from '@tanstack/react-query';

import type { HighlightListParams } from './highlightListQueryOptions';
import { highlightQueries } from './highlightQueries';

const useHighlightList = (params: HighlightListParams) => useQuery(highlightQueries.list(params));

export { useHighlightList };
