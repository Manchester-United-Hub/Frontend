/**
 * toMatchItem 단위 테스트.
 *
 * 검증 목적:
 * - competition은 '프리미어리그' 리터럴 고정(D-6) — 상수를 import해 되비교하지 않는다
 * - MatchSide.code가 런타임에 undefined일 때 FALLBACK_TEAM_CODE('-')로 치환
 * - kickoff → 'M월 D일 (요일)' 날짜 포맷
 * - variant('next' | 'past')에 따른 tag 분기 및 필드 전달
 */
import { describe, it, expect } from 'vitest';

import type { Match, MatchSide } from '@entities/matches/types';

import { toMatchItem } from '@pages/landing/model/toMatchItem';

const createSide = (overrides: Partial<MatchSide> = {}): MatchSide => ({
  code: 'MUN',
  teamLogoUrl: 'https://example.com/mun.png',
  nm: '맨체스터 유나이티드',
  ...overrides,
});

const createMatch = (overrides: Partial<Match> = {}): Match => ({
  id: '1001',
  month: '2025년 5월',
  date: '5/11',
  dow: '일',
  ha: 'home',
  home: createSide(),
  away: createSide({ code: 'EVE', nm: '에버턴', utd: undefined }),
  status: 'past',
  venue: '올드 트래포드',
  kickoff: '2025-05-11T20:00:00',
  ...overrides,
});

describe('toMatchItem', () => {
  it('competition을 프리미어리그 리터럴로 고정한다', () => {
    const result = toMatchItem(createMatch(), 'past');

    expect(result.competition).toBe('프리미어리그');
  });

  it('team code가 런타임에 undefined면 폴백(-)으로 치환한다', () => {
    const match = createMatch({
      home: createSide({ code: undefined as unknown as string }),
      away: createSide({ code: undefined as unknown as string, nm: '첼시' }),
    });

    const result = toMatchItem(match, 'past');

    expect(result.home.code).toBe('-');
    expect(result.away.code).toBe('-');
  });

  it('code가 있으면 폴백 없이 그대로 전달한다', () => {
    const result = toMatchItem(createMatch(), 'past');

    expect(result.home.code).toBe('MUN');
    expect(result.away.code).toBe('EVE');
  });

  it('kickoff을 M월 D일 (요일) 형식으로 포맷한다', () => {
    const result = toMatchItem(
      createMatch({ kickoff: '2025-05-11T20:00:00' }),
      'past'
    );

    expect(result.date).toBe('5월 11일 (일)');
  });

  it("variant='next'면 tag를 '다음 경기'로, status는 그대로 반환한다", () => {
    const match = createMatch({
      status: 'next',
      time: '23:30',
      countdown: 'D-3',
    });

    const result = toMatchItem(match, 'next');

    expect(result.variant).toBe('next');
    expect(result.tag).toBe('다음 경기');
    expect(result.time).toBe('23:30');
    expect(result.countdown).toBe('D-3');
  });

  it("variant='past'면 tag를 '최근 경기'로 반환하고 result·venue를 전달한다", () => {
    const match = createMatch({ result: 'W', venue: '아멕스 스타디움' });

    const result = toMatchItem(match, 'past');

    expect(result.variant).toBe('past');
    expect(result.tag).toBe('최근 경기');
    expect(result.result).toBe('W');
    expect(result.venue).toBe('아멕스 스타디움');
  });

  it("time에 'KST' 접미사를 붙이지 않고 match.time을 그대로 쓴다", () => {
    const result = toMatchItem(createMatch({ time: '20:00' }), 'past');

    expect(result.time).toBe('20:00');
  });
});
