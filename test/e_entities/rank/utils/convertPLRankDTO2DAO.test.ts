/**
 * convertPLRankDTO2DAO 단위 테스트.
 *
 * 검증 목적:
 * - zone 산출 로직(D-6 순위 기반 매핑) 경계값 전체
 * - utd(맨유 강조 플래그)가 zone과 독립적으로 teamId===33에서만 참임을 회귀 검증
 *   (과거 결함: 순위와 무관하게 맨유만 항상 zone:'releg'였던 버그의 재발 방지)
 * - 팀 코드·한글명 매핑과 미매핑 팀 폴백
 * - p(경기 수)·pts·diff 필드 매핑
 * - form 변환(null → []·유효 문자열·잘못된 문자 시 에러)
 */

import { describe, it, expect } from 'vitest';

import { convertPLRankDTO2DAO } from '@entities/rank/utils';
import type { PLRankDTO, PLRankTeamDTO } from '@entities/rank/types';

const MANCHESTER_UNITED_TEAM_ID = 33;
const OTHER_TEAM_ID = 1;

const createRankTeamDTO = (
  overrides: Partial<PLRankTeamDTO> = {}
): PLRankTeamDTO => ({
  rank: 1,
  teamId: MANCHESTER_UNITED_TEAM_ID,
  teamName: 'Manchester United',
  teamLogo: 'https://example.com/mun.png',
  points: 70,
  played: 30,
  win: 22,
  draw: 4,
  lose: 4,
  goalsFor: 60,
  goalsAgainst: 25,
  goalsDiff: 35,
  form: 'WWDWL',
  ...overrides,
});

const convertOne = (overrides: Partial<PLRankTeamDTO> = {}) => {
  const dto: PLRankDTO = { season: '2025-26', ranks: [createRankTeamDTO(overrides)] };
  return convertPLRankDTO2DAO(dto)[0];
};

describe('convertPLRankDTO2DAO — zone 매핑(D-6, pos 기반)', () => {
  it('pos 1~4는 ucl이다', () => {
    expect(convertOne({ rank: 1 }).zone).toBe('ucl');
    expect(convertOne({ rank: 4 }).zone).toBe('ucl');
  });

  it('pos 5는 uel이다', () => {
    expect(convertOne({ rank: 5 }).zone).toBe('uel');
  });

  it('pos 6은 conf다', () => {
    expect(convertOne({ rank: 6 }).zone).toBe('conf');
  });

  it('pos 7은 어느 존에도 속하지 않아 빈 문자열이다', () => {
    expect(convertOne({ rank: 7 }).zone).toBe('');
  });

  it('pos 17은 어느 존에도 속하지 않아 빈 문자열이다', () => {
    expect(convertOne({ rank: 17 }).zone).toBe('');
  });

  it('pos 18~20은 releg다', () => {
    expect(convertOne({ rank: 18 }).zone).toBe('releg');
    expect(convertOne({ rank: 20 }).zone).toBe('releg');
  });

  it('pos 20을 초과하면 빈 문자열이다', () => {
    expect(convertOne({ rank: 21 }).zone).toBe('');
  });
});

describe('convertPLRankDTO2DAO — utd·zone 독립성(회귀 방지)', () => {
  it('맨유가 pos 1(ucl 구간)이면 zone은 ucl이면서 utd는 true다', () => {
    const standing = convertOne({
      teamId: MANCHESTER_UNITED_TEAM_ID,
      rank: 1,
    });

    expect(standing.zone).toBe('ucl');
    expect(standing.utd).toBe(true);
  });

  it('맨유가 아닌 팀은 releg 구간이어도 utd가 undefined다', () => {
    const standing = convertOne({ teamId: OTHER_TEAM_ID, rank: 20 });

    expect(standing.zone).toBe('releg');
    expect(standing.utd).toBeUndefined();
  });
});

describe('convertPLRankDTO2DAO — 팀 코드·한글명 매핑', () => {
  it('사전에 있는 팀명을 코드·한글명으로 바꾼다', () => {
    const standing = convertOne({ teamName: 'Everton' });

    expect(standing.code).toBe('EVE');
    expect(standing.nm).toBe('에버턴');
  });

  it('사전에 없는 팀명은 원본 이름을 코드·한글명 양쪽에 그대로 쓴다', () => {
    const standing = convertOne({ teamName: 'Burnley' });

    expect(standing.code).toBe('Burnley');
    expect(standing.nm).toBe('Burnley');
  });

  it('팀 로고 URL을 그대로 전달한다', () => {
    const standing = convertOne({ teamLogo: 'https://example.com/eve.png' });

    expect(standing.teamLogoUrl).toBe('https://example.com/eve.png');
  });
});

describe('convertPLRankDTO2DAO — 경기 수·승점·득실차', () => {
  it('p는 win+draw+lose 합이다', () => {
    const standing = convertOne({ win: 10, draw: 5, lose: 3 });

    expect(standing.p).toBe(18);
  });

  it('pts는 points를 그대로 전달한다', () => {
    const standing = convertOne({ points: 55 });

    expect(standing.pts).toBe(55);
  });

  it('diff는 goalsDiff를 그대로 전달한다', () => {
    const standing = convertOne({ goalsDiff: -12 });

    expect(standing.diff).toBe(-12);
  });

  it('gf·ga는 goalsFor·goalsAgainst를 그대로 전달한다', () => {
    const standing = convertOne({ goalsFor: 8, goalsAgainst: 15 });

    expect(standing.gf).toBe(8);
    expect(standing.ga).toBe(15);
  });
});

describe('convertPLRankDTO2DAO — form 변환', () => {
  it('form이 null이면 빈 배열이다', () => {
    const standing = convertOne({ form: null });

    expect(standing.form).toEqual([]);
  });

  it('유효한 form 문자열을 결과 배열로 변환한다', () => {
    const standing = convertOne({ form: 'WDLWD' });

    expect(standing.form).toEqual(['W', 'D', 'L', 'W', 'D']);
  });

  it("W·D·L 외 문자가 섞이면 에러를 던진다", () => {
    expect(() => convertOne({ form: 'WDXWL' })).toThrow(
      "FormConvertError: form is not composed of 'W' or 'D' or 'L'."
    );
  });
});

describe('convertPLRankDTO2DAO — 그 외 필드·목록', () => {
  it('mv는 항상 same이다', () => {
    expect(convertOne().mv).toBe('same');
  });

  it('빈 배열을 넣으면 빈 배열을 반환한다', () => {
    const dto: PLRankDTO = { season: '2025-26', ranks: [] };

    expect(convertPLRankDTO2DAO(dto)).toEqual([]);
  });
});
