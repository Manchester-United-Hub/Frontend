import z from 'zod';
import {
  RankDetailSeasonPlayerDTOSchema,
  RankSeasonDTOSchema,
  RankTeamDTOSchema,
} from '../../schemas';

type PLRankTeamDTO = z.infer<typeof RankTeamDTOSchema>;
type PLRankDTO = z.infer<typeof RankSeasonDTOSchema>;
type PLPlayerRankDTO = z.infer<typeof RankDetailSeasonPlayerDTOSchema>;

export type { PLRankDTO, PLPlayerRankDTO, PLRankTeamDTO };
