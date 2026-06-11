import z from 'zod';

const DateStringType = {
  'yyyy-MM-ddTHH:mm': z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid datetime'),
  'yyyy-MM-dd': z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date'),
};

export { DateStringType };
