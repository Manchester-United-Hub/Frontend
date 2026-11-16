import { HighlightListDTOSchema } from '@entities/highlight/model';
import type { HighlightListDTO, HighlightListQueryDTO } from '@entities/highlight/model';
import { API_PATH, serverFetcher } from '@shared/api';
import { toServerApiResult } from '@shared/model';
import type { ServerApiResult } from '@shared/model';

const fetchHighlightList = async (
  query: HighlightListQueryDTO
): Promise<ServerApiResult<HighlightListDTO>> => {
  const response = await serverFetcher.get(API_PATH.highlightList(), query);
  const data = await response.json();

  return toServerApiResult(response, data, HighlightListDTOSchema);
};

export { fetchHighlightList };
