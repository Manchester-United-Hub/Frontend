/**
 * buildCountdownLabel 단위 테스트(High-2 부수 쟁점 재작업, D-11).
 *
 * 검증 목적:
 * - now를 주입받아 순수 함수로 동작하는지(테스트 가능성)
 * - 내일 kickoff → 'D-1'
 * - 당일(now와 같은 시각) kickoff → 'D-0'
 * - 과거 kickoff → 'D-0' (Math.max(0, …) — 음수 방지)
 *
 * 리터럴 기대값으로 단언한다 — convertMatchesDTO2DAO.ts의 calculateDaysUntil을 오라클로
 * 쓰지 않는다. 두 공식이 갈라져도 이 테스트가 잡을 수 있어야 한다(알려진 부채).
 */

import { describe, it, expect } from 'vitest';

import { buildCountdownLabel } from '@entities/matches/utils/buildCountdownLabel';

const NOW = new Date('2026-01-10T00:00:00');

describe('buildCountdownLabel', () => {
  it('내일 kickoff이면 D-1을 반환한다', () => {
    const result = buildCountdownLabel('2026-01-11T00:00:00', NOW);

    expect(result).toBe('D-1');
  });

  it('kickoff이 now와 같은 시각(당일)이면 D-0을 반환한다', () => {
    const result = buildCountdownLabel('2026-01-10T00:00:00', NOW);

    expect(result).toBe('D-0');
  });

  it('kickoff이 now보다 과거이면 음수 대신 D-0을 반환한다', () => {
    const result = buildCountdownLabel('2026-01-09T00:00:00', NOW);

    expect(result).toBe('D-0');
  });
});
