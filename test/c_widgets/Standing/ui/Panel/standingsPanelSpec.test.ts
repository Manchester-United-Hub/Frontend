/**
 * standingsPanelSpec 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 리터럴 기대값으로 단언한다(F-34) — 대상 모듈의 함수를 기대값 계산에 쓰지 않는다.
 */

import { describe, expect, it } from 'vitest';

import { standingsPanelHead } from '@widgets/Standing/ui/Panel/standingsPanelSpec';

describe('standingsPanelSpec', () => {
  it('standingsPanelHead(season)은 시즌 문구가 포함된 PanelHeadProps를 반환한다', () => {
    expect(standingsPanelHead('2025/26')).toEqual({
      eyebrow: 'League Table',
      title: '순위표',
      description:
        '2025/26 시즌 프리미어리그 20개 클럽의 순위와 최근 5경기 폼을 확인하세요.',
    });
  });
});
