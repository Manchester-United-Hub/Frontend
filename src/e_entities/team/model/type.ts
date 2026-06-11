import z from 'zod';
import {
  TeamStatisticsDTOSchema,
  TeamStatisticsListDTOSchema,
  TeamInfoParamsDTOSchema,
  TeamInfoDTOSchema,
} from './schemas';

type TeamStatisticsDTO = z.infer<typeof TeamStatisticsDTOSchema>;
type TeamStatisticsListDTO = z.infer<typeof TeamStatisticsListDTOSchema>;
type TeamInfoParamsDTO = z.infer<typeof TeamInfoParamsDTOSchema>;
type TeamInfoDTO = z.infer<typeof TeamInfoDTOSchema>;

export type { TeamInfoDTO, TeamInfoParamsDTO, TeamStatisticsDTO, TeamStatisticsListDTO };
