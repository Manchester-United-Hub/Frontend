/**
 * resolveSeasonStatus 단위 테스트.
 *
 * 검증 목적:
 * - started: boolean → SeasonStatus('upcoming' | 'ongoing') 2단계 매핑만 검증한다.
 * - D-1이 '종료됨' 3단계 확장을 명시적으로 금지했다. 일정·날짜로 종료를 추론하는
 *   케이스는 여기 존재하지 않으며, 앞으로도 추가하지 않는다(plan.json ST-03/ST-09 명세).
 */

import { describe, it, expect } from 'vitest';

import { resolveSeasonStatus } from '@entities/seasonInfo/utils';

describe('resolveSeasonStatus', () => {
  it('started=false면 upcoming을 반환한다', () => {
    expect(resolveSeasonStatus(false)).toBe('upcoming');
  });

  it('started=true면 ongoing을 반환한다', () => {
    expect(resolveSeasonStatus(true)).toBe('ongoing');
  });
});
