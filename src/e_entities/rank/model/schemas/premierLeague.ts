import z from 'zod';

const RankTeamDTOSchema = z.object({
  rank: z.number(),
  teamId: z.number(),
  teamName: z.string(),
  teamLogo: z.string(),
  points: z.number(),
  played: z.number(),
  win: z.number(),
  draw: z.number(),
  lose: z.number(),
  goalsFor: z.number(),
  goalsAgainst: z.number(),
  goalsDiff: z.number(),
  form: z.string().max(5).nullable(),
});

const RankDTOSchema = z.array(RankTeamDTOSchema);
const RankSeasonDTOSchema = z.object({
  season: z.string(),
  ranks: RankDTOSchema,
});

export { RankSeasonDTOSchema, RankTeamDTOSchema, RankDTOSchema };
