import z from 'zod';

const CurrentSeasonDTOSchema = z.object({
  season: z.number(),
  started: z.boolean(),
});

export { CurrentSeasonDTOSchema };
