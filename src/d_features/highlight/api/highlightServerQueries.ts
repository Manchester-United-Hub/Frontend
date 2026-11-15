import { fetchHighlightList } from '@entities/highlight/api/server';
import type { HighlightListDTO, HighlightListQueryDTO } from '@entities/highlight/model';

import { highlightListQueryOptions, type HighlightListParams } from './highlightListQueryOptions';

// 서버 전용 — 백엔드를 직접 호출하므로 d_features/highlight/api 배럴에 넣지 않는다.
const fetchHighlightListOnServer = async (
  query: HighlightListQueryDTO
): Promise<HighlightListDTO> => {
  const result = await fetchHighlightList(query);
  if (!result.isSuccess) {
    throw new Error(result.data.message);
  }
  return result.data;
};

const highlightServerQueries = {
  list: (params: HighlightListParams) =>
    highlightListQueryOptions(fetchHighlightListOnServer, params),
};

export { highlightServerQueries };
