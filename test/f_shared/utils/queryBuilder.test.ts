import { describe, it, expect } from 'vitest';
import { buildQuery } from '@shared/utils';

describe('buildQuery', () => {
  describe('Record Type', () => {
    it('빈 객체이면 빈 문자열을 반환한다', () => {
      expect(buildQuery({})).toBe('');
    });

    it('단일 항목은 ?key=value 형태로 반환한다', () => {
      expect(buildQuery({ page: 1 })).toBe('?page=1');
    });

    it('여러 항목은 &로 구분된 쿼리 문자열을 반환한다', () => {
      expect(buildQuery({ page: 1, size: 10 })).toBe('?page=1&size=10');
    });
  });

  describe('Iterable Type', () => {
    it('빈 Map이면 빈 문자열을 반환한다', () => {
      expect(buildQuery(new Map())).toBe('');
    });

    it('Map은 ?key=value 형태로 반환한다', () => {
      expect(buildQuery(new Map([['page', 1]]))).toBe('?page=1');
    });

    it('튜플 배열은 ?key=value 형태로 반환한다', () => {
      expect(buildQuery([['page', 1] as [string, unknown]])).toBe('?page=1');
    });
  });
});
