import z from 'zod';
import { CareerDTOSchema, CoachDTOSchema } from './schemas';

type CareerDTO = z.infer<typeof CareerDTOSchema>;
type CoachDTO = z.infer<typeof CoachDTOSchema>;

export type { CareerDTO, CoachDTO };
