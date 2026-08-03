import z from 'zod';
import type { ApiErrorResponse } from './ApiWrapper';
import type { ServerApiResult } from './serverApi';

const UPSTREAM_CONTRACT_MISMATCH = 'UPSTREAM_CONTRACT_MISMATCH';
const BAD_GATEWAY = 502;

const toServerApiResult = <T>(
  response: Response,
  data: unknown,
  schema: z.ZodType<T>
): ServerApiResult<T> => {
  if (!response.ok) {
    return {
      isSuccess: false,
      status: response.status,
      data: data as ApiErrorResponse,
    };
  }

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      isSuccess: false,
      status: BAD_GATEWAY,
      data: {
        code: UPSTREAM_CONTRACT_MISMATCH,
        message: z.prettifyError(parsed.error),
      },
    };
  }

  return { isSuccess: true, status: response.status, data: parsed.data };
};

export { toServerApiResult };
