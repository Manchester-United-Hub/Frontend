import z from 'zod';
import {
  PLRankParamsSchema,
  RankDetailSeasonPlayerDTOSchema,
  RankSeasonDTOSchema,
  RankTeamDTOSchema,
} from '../schemas';

type PLRankTeamDTO = z.infer<typeof RankTeamDTOSchema>;
type PLRankDTO = z.infer<typeof RankSeasonDTOSchema>;
type PLPlayerRankDTO = z.infer<typeof RankDetailSeasonPlayerDTOSchema>;
// A-6: season은 시즌 시작연도(number). schedule의 MatchScheduleParams.season(string)과는
// 의도적으로 타입이 다르다 — 통일은 스코프 밖(R-10).
type PLRankParams = z.infer<typeof PLRankParamsSchema>;

export type { PLRankDTO, PLPlayerRankDTO, PLRankTeamDTO, PLRankParams };
