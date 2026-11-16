import { BFF_PATH, clientFetcher } from '@shared/api';
import type { BffApiResponse } from '@shared/model';
import type { HighlightListDTO, HighlightListQueryDTO } from '@entities/highlight/model';

const getHighlightList = async (
  query: HighlightListQueryDTO
): Promise<BffApiResponse<HighlightListDTO>> => {
  const response = await clientFetcher.get(BFF_PATH.highlightList(), query);
  return response.json();
};

export { getHighlightList };
