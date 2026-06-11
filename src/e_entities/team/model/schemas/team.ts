import z from 'zod';

const TeamStatisticsDTOSchema = z.object({
  teamId: z.number(),
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

const TeamInfoParamsDTOSchema = z.object({
  teamId: z.number(),
});

const TeamInfoDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.httpUrl(),
  founded: z.number(),
  location: z.string(),
  stadium: z.string(),
  coachName: z.string(),
});

export {
  TeamStatisticsDTOSchema,
  TeamStatisticsListDTOSchema,
  TeamInfoParamsDTOSchema,
  TeamInfoDTOSchema,
};
