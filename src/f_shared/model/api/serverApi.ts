import { z } from 'zod';

const ApiErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

type ServerApiResult<T> =
  | { isSuccess: true; status: number; data: T }
  | { isSuccess: false; status: number; data: ApiErrorResponse };

export type { ApiErrorResponse, ServerApiResult };
export { ApiErrorResponseSchema };
