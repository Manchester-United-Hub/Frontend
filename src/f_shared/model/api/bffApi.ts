import { z } from 'zod';
import { ServerApiResult } from './serverApi';

const BffApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    error: z.null(),
  });

const BffApiErrorSchema = z.object({
  success: z.literal(false),
  data: z.null(),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

const BffApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([BffApiSuccessSchema(dataSchema), BffApiErrorSchema]);

type BffApiSuccess<T> = z.infer<ReturnType<typeof BffApiSuccessSchema<z.ZodType<T>>>>;
type BffApiError = z.infer<typeof BffApiErrorSchema>;
type BffApiResponse<T> = BffApiSuccess<T> | BffApiError;

const toBffResponse = <T>(result: ServerApiResult<T>): BffApiResponse<T> =>
  result.isSuccess
    ? { success: true, data: result.data, error: null }
    : { success: false, data: null, error: result.data };

export type { BffApiResponse, BffApiSuccess, BffApiError };
export { BffApiResponseSchema, BffApiSuccessSchema, BffApiErrorSchema, toBffResponse };
