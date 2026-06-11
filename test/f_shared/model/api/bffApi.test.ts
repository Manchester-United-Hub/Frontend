import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  BffApiSuccessSchema,
  BffApiErrorSchema,
  BffApiResponseSchema,
  toBffResponse,
} from '@shared/model/api';

const DataSchema = z.object({ id: z.number() });

describe('BffApiSuccessSchema', () => {
  it('success:true면 통과한다', () => {
    const result = BffApiSuccessSchema(DataSchema).safeParse({
      success: true,
      data: { id: 1 },
      error: null,
    });
    expect(result.success).toBe(true);
  });
});

describe('BffApiErrorSchema', () => {
  it('success:false 형태를 통과한다', () => {
    const result = BffApiErrorSchema.safeParse({
      success: false,
      data: null,
      error: { code: 'NOT_FOUND', message: '리소스를 찾을 수 없습니다.' },
    });
    expect(result.success).toBe(true);
  });
});

describe('BffApiResponseSchema', () => {
  it('성공 응답을 통과한다', () => {
    const result = BffApiResponseSchema(DataSchema).safeParse({
      success: true,
      data: { id: 1 },
      error: null,
    });
    expect(result.success).toBe(true);
  });

  it('에러 응답을 통과한다', () => {
    const result = BffApiResponseSchema(DataSchema).safeParse({
      success: false,
      data: null,
      error: { code: 'SERVER_ERROR', message: '서버 오류' },
    });
    expect(result.success).toBe(true);
  });

  it('유효하지 않은 형태는 실패한다', () => {
    const result = BffApiResponseSchema(DataSchema).safeParse({
      success: true,
      data: null,
      error: { code: 'ERR', message: 'msg' },
    });
    expect(result.success).toBe(false);
  });
});

describe('toBffResponse', () => {
  it('isSuccess:true이면 success:true 응답을 반환한다', () => {
    const result = toBffResponse({ isSuccess: true, status: 200, data: { id: 1 } });
    expect(result).toEqual({ success: true, data: { id: 1 }, error: null });
  });

  it('isSuccess:false이면 success:false 응답을 반환한다', () => {
    const error = { code: 'NOT_FOUND', message: '없음' };
    const result = toBffResponse({ isSuccess: false, status: 404, data: error });
    expect(result).toEqual({ success: false, data: null, error });
  });
});
