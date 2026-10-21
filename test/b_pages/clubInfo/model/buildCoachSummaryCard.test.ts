import { describe, expect, it } from 'vitest';

import { buildCoachSummaryCard } from '@pages/clubInfo/model/buildCoachSummaryCard';
import { MANAGER_FIXTURE } from '@test/fixtures/coach';

describe('buildCoachSummaryCard', () => {
  it('감독 이름과 부임 시기로 감독 카드를 만든다', () => {
    expect(buildCoachSummaryCard(MANAGER_FIXTURE)).toEqual({
      icon: 'User',
      label: '감독',
      en: 'COACH',
      value: 'Michael Carrick',
      sub: '2025년 8월 부임',
    });
  });

  it('감독 정보가 없으면(null) 값과 보조 텍스트를 "-"로 둔다', () => {
    expect(buildCoachSummaryCard(null)).toMatchObject({ label: '감독', value: '-', sub: '-' });
  });
});
