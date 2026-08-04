/**
 * rankKeys 단위 테스트.
 *
 * 검증 목적:
 * - all·pl() 키 값
 * - pl()이 all을 접두로 포함한다 (계층 무효화 전제)
 */

import { describe, it, expect } from 'vitest';

import { rankKeys } from '@features/rank/api/rankKeys';

describe('rankKeys', () => {
  it('all은 ["rank"]이다', () => {
    expect(rankKeys.all).toEqual(['rank']);
  });

  it('pl()은 ["rank", "premierLeague"]이다', () => {
    expect(rankKeys.pl()).toEqual(['rank', 'premierLeague']);
  });

  it('pl()은 all을 접두로 포함해 계층 무효화가 가능하다', () => {
    expect(rankKeys.pl().slice(0, rankKeys.all.length)).toEqual(
      rankKeys.all
    );
  });

  it('pl()은 호출할 때마다 동일한 키를 만든다', () => {
    expect(rankKeys.pl()).toEqual(rankKeys.pl());
  });
});
