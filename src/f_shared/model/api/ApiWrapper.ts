import z from 'zod';

const ApiErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});

type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

type ApiResponseWrapper<T, E = ApiErrorResponse> =
  | { isSuccess: true; status: number; data: T }
  | { isSuccess: false; status: number; data: E };

export type { ApiResponseWrapper, ApiErrorResponse };
export { ApiErrorResponseSchema };
