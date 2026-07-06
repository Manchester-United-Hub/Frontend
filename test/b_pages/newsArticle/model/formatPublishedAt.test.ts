import { describe, expect, it } from 'vitest';

import { formatPublishedAt } from '@pages/newsArticle/model';

describe('formatPublishedAt', () => {
  it('ISO 문자열을 YYYY.MM.DD로 포맷한다', () => {
    expect(formatPublishedAt('2025-05-18T22:45')).toBe('2025.05.18');
  });

  it('월·일을 2자리로 패딩한다', () => {
    expect(formatPublishedAt('2025-01-04T09:00')).toBe('2025.01.04');
  });

  it('파싱 불가한 값은 원본을 그대로 반환한다', () => {
    expect(formatPublishedAt('not-a-date')).toBe('not-a-date');
  });
});
