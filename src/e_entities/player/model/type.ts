import z from 'zod';
import {
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
} from './schemas';

type PlayerListQueryDTO = z.infer<typeof PlayerListQueryDTOSchema>;
type PlyaerDTO = z.infer<typeof PlayerDTOSchema>;
type PlyaerListDTO = z.infer<typeof PlayerListDTOSchema>;

export type { PlayerListQueryDTO, PlyaerDTO, PlyaerListDTO };
