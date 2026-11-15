import type z from 'zod';

import type {
  HighlightDTOSchema,
  HighlightListDTOSchema,
  HighlightListQueryDTOSchema,
} from './schemas';

type HighlightListQueryDTO = z.infer<typeof HighlightListQueryDTOSchema>;
type HighlightListSort = NonNullable<HighlightListQueryDTO['sort']>;
type HighlightDTO = z.infer<typeof HighlightDTOSchema>;
type HighlightListDTO = z.infer<typeof HighlightListDTOSchema>;

export type { HighlightListQueryDTO, HighlightListSort, HighlightDTO, HighlightListDTO };
