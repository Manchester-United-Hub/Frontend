import z from 'zod';

const CareerDTOSchema = z.object({
  startDate: z.string(),
  endDate: z.string().nullable(),
  team: z.string(),
});

const CoachDTOSchema = z.object({
  id: z.number(),
  teamId: z.number(),
  name: z.string(),
  photo: z.httpUrl().nullable(),
  birthDate: z.string().nullable(),
  birthPlace: z.string().nullable(),
  appointmentDate: z.string().nullable(),
  contractEndDate: z.string().nullable(),
  nationality: z.string().nullable(),
  careers: z.array(CareerDTOSchema),
});

export { CareerDTOSchema, CoachDTOSchema };
