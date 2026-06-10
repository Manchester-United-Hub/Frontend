import z from 'zod';

const TeamStatisticsDTOSchema = z.object({
  teamId: z.bigint(),
  teamName: z.string(),
  season: z.number(),
  win: z.number(),
  draw: z.number(),
  lose: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  points: z.number(),
  rank: z.number(),
});

const TeamStatisticsListDTOSchema = z.array(TeamStatisticsDTOSchema);

type TeamStatisticsDTO = z.infer<typeof TeamStatisticsDTOSchema>;
type TeamStatisticsListDTO = z.infer<typeof TeamStatisticsListDTOSchema>;

const TeamInfoParamsDTOSchema = z.object({
  teamId: z.bigint(),
});

const TeamInfoDTOSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  photo: z.httpUrl(),
  founded: z.number(),
  location: z.string(),
  stadium: z.string(),
  coachName: z.string(),
});

type TeamInfoParamsDTO = z.infer<typeof TeamInfoParamsDTOSchema>;
type TeamInfoDTO = z.infer<typeof TeamInfoDTOSchema>;

export type {
  TeamInfoDTO,
  TeamInfoParamsDTO,
  TeamStatisticsDTO,
  TeamStatisticsListDTO,
};
export {
  TeamInfoDTOSchema,
  TeamInfoParamsDTOSchema,
  TeamStatisticsDTOSchema,
  TeamStatisticsListDTOSchema,
};
