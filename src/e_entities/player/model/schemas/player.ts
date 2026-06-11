import z from 'zod';
import { DateStringType } from '@shared/model';

const PlayerListQueryDTOSchema = z.object({
  season: z.number(),
  position: z.string().optional(),
});

const PlayerDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  birthDate: DateStringType['yyyy-MM-dd'],
  nationality: z.string(),
  height: z.string(),
  weight: z.string(),
  number: z.number().nullable(),
  position: z.string(),
  photo: z.string(),
});

const PlayerListDTOSchema = z.object({
  players: z.array(PlayerDTOSchema),
});

export { PlayerListQueryDTOSchema, PlayerDTOSchema, PlayerListDTOSchema };
