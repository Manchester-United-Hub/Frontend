import { describe, it, expect } from 'vitest';
import { ApiErrorResponseSchema } from '@shared/model/api';

describe('ApiErrorResponseSchema', () => {
  it('code와 message가 있으면 통과한다', () => {
    const result = ApiErrorResponseSchema.safeParse({
      code: 'NOT_FOUND',
      message: '없음',
    });
    expect(result.success).toBe(true);
  });

  it('code가 없으면 실패한다', () => {
    const result = ApiErrorResponseSchema.safeParse({ message: '없음' });
    expect(result.success).toBe(false);
  });

  it('message가 없으면 실패한다', () => {
    const result = ApiErrorResponseSchema.safeParse({ code: 'ERR' });
    expect(result.success).toBe(false);
  });
});
