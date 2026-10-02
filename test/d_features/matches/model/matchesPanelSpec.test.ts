/**
 * matchesPanelSpec 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 리터럴 기대값으로 단언한다(F-34) — 대상 모듈의 상수·함수를 기대값 계산에 쓰지 않는다.
 */

import { describe, expect, it } from 'vitest';

import {
  FILTER_ROW_CLASS,
  matchesPanelHead,
} from '@features/matches/model/matchesPanelSpec';

describe('matchesPanelSpec', () => {
  it('FILTER_ROW_CLASS는 mb-6 flex flex-wrap gap-6이다', () => {
    expect(FILTER_ROW_CLASS).toBe('mb-6 flex flex-wrap gap-6');
  });

  it('matchesPanelHead(season)은 시즌 문구가 포함된 PanelHeadProps를 반환한다', () => {
    expect(matchesPanelHead('2025/26')).toEqual({
      eyebrow: 'Matches & Results',
      title: '일정 & 결과',
      description:
        '2025/26 시즌 프리미어리그·FA컵·챔피언스리그 일정과 결과를 확인하세요.',
    });
  });
});
