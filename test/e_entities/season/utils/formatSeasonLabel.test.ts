import { describe, it, expect } from 'vitest';

import { formatSeasonLabel } from '@entities/season/utils';

describe('formatSeasonLabel', () => {
  it('시즌 시작연도를 다음연도 두 자리와 결합한 라벨로 변환한다', () => {
    expect(formatSeasonLabel(2026)).toBe('2026-27');
  });

  it('다음연도 두 자리 수 경계값도 그대로 결합한다', () => {
    expect(formatSeasonLabel(2009)).toBe('2009-10');
  });

  it('다음연도가 한 자리 수면 0으로 패딩한다', () => {
    expect(formatSeasonLabel(2000)).toBe('2000-01');
  });

  it('연도가 넘어가면 00으로 순환한다', () => {
    expect(formatSeasonLabel(2099)).toBe('2099-00');
  });
});
