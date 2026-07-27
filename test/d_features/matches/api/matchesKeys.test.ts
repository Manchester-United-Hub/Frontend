/**
 * matchesKeys 단위 테스트.
 *
 * 검증 목적:
 * - all·schedules() 키 값
 * - schedules()가 all을 접두로 포함한다 (계층 무효화 전제)
 */

import { describe, it, expect } from 'vitest';

import { matchesKeys } from '@features/matches/api/matchesKeys';

describe('matchesKeys', () => {
  it('all은 ["matches"]이다', () => {
    expect(matchesKeys.all).toEqual(['matches']);
  });

  it('schedules()는 ["matches", "schedule"]이다', () => {
    expect(matchesKeys.schedules()).toEqual(['matches', 'schedule']);
  });

  it('schedules()는 all을 접두로 포함해 계층 무효화가 가능하다', () => {
    expect(matchesKeys.schedules().slice(0, matchesKeys.all.length)).toEqual(
      matchesKeys.all
    );
  });

  it('schedules()는 호출할 때마다 동일한 키를 만든다', () => {
    expect(matchesKeys.schedules()).toEqual(matchesKeys.schedules());
  });
});
