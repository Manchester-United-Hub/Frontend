import z from 'zod';

const RankDetailPlayerDTOSChema = z.object({
  rank: z.number(),
  playerId: z.number(),
  playerName: z.string(),
  playerPhoto: z.httpUrl(),
  teamId: z.number(),
  teamName: z.string(),
  teamLogo: z.httpUrl(),
  goals: z.number(),
  assists: z.number(),
  appearences: z.number(),
  minutes: z.number(),
  shots: z.number(),
  shotsOnTarget: z.number(),
  keyPasses: z.number(),
});

const RankDetailPlayerListDTOSchema = z.array(RankDetailPlayerDTOSChema);

const RankDetailSeasonPlayerDTOSchema = z.object({
  season: z.string(),
  ranks: RankDetailPlayerListDTOSchema,
});

export {
  RankDetailSeasonPlayerDTOSchema,
  RankDetailPlayerListDTOSchema,
  RankDetailPlayerDTOSChema,
};
