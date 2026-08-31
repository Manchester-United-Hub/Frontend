import z from 'zod';
import {
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
  LeagueStatisticsDTOSchema,
  PlayerStatisticsListDTOSchema,
} from './schemas';

type PlayerListQueryDTO = z.infer<typeof PlayerListQueryDTOSchema>;
type PlyaerDTO = z.infer<typeof PlayerDTOSchema>;
type PlyaerListDTO = z.infer<typeof PlayerListDTOSchema>;
type LeagueStatisticsDTO = z.infer<typeof LeagueStatisticsDTOSchema>;
type PlayerStatisticsListDTO = z.infer<typeof PlayerStatisticsListDTOSchema>;

export type {
  PlayerListQueryDTO,
  PlyaerDTO,
  PlyaerListDTO,
  LeagueStatisticsDTO,
  PlayerStatisticsListDTO,
};
