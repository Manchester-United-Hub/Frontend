import { getHighlightList } from '@entities/highlight/api/client';
import type { HighlightListDTO, HighlightListQueryDTO } from '@entities/highlight/model';

import { highlightListQueryOptions, type HighlightListParams } from './highlightListQueryOptions';

const fetchHighlightListViaBff = async (
  query: HighlightListQueryDTO
): Promise<HighlightListDTO> => {
  const response = await getHighlightList(query);
  if (!response.success) {
    throw new Error(response.error.message);
  }
  return response.data;
};

const highlightQueries = {
  list: (params: HighlightListParams) => highlightListQueryOptions(fetchHighlightListViaBff, params),
};

export { highlightQueries };
