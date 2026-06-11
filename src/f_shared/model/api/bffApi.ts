import { z } from 'zod';
import { ApiResponseWrapper } from './ApiWrapper';

const BffApiSuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
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

const BffApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.union([BffApiSuccessSchema(dataSchema), BffApiErrorSchema]);

type BffApiSuccess<T> = z.infer<
  ReturnType<typeof BffApiSuccessSchema<z.ZodType<T>>>
>;
type BffApiError = z.infer<typeof BffApiErrorSchema>;
type BffApiResponse<T> = BffApiSuccess<T> | BffApiError;

const toBffResponse = <T>(result: ApiResponseWrapper<T>): BffApiResponse<T> =>
  result.isSuccess
    ? { success: true, data: result.data, error: null }
    : { success: false, data: null, error: result.data };

export type { BffApiResponse, BffApiSuccess, BffApiError };
export {
  BffApiResponseSchema,
  BffApiSuccessSchema,
  BffApiErrorSchema,
  toBffResponse,
};
