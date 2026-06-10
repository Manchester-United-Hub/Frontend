import z from 'zod';

const DateStringType = {
  'yyyy-MM-ddTHH:mm': z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
  'yyyy-MM-dd': z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
};

export { DateStringType };
