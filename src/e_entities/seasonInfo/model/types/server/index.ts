import z from 'zod';
import { CurrentSeasonDTOSchema } from '../../schemas';

type CurrentSeasonDTO = z.infer<typeof CurrentSeasonDTOSchema>;

export type { CurrentSeasonDTO };
