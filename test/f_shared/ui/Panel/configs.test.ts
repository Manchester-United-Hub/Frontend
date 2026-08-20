/**
 * panelShell 상수 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 리터럴 기대값으로 단언한다(F-34) — 대상 모듈의 상수를 import해 기대값을 만들면
 * 그 상수 자체가 검증되지 않는다.
 */

import { describe, expect, it } from 'vitest';

import { PANEL_SHELL_CLASS } from '@shared/ui/Panel/configs';

describe('panelShell', () => {
  it('PANEL_SHELL_CLASS는 pb-16 pt-10이다', () => {
    expect(PANEL_SHELL_CLASS).toBe('pb-16 pt-10');
  });
});
