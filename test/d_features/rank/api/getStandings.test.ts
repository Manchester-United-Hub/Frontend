/**
 * getStandings 단위 테스트 (decision-1.md §5 ST-09 재정의 — 이 파일이 정본).
 *
 * 'use cache'는 vitest(esbuild) 환경에서 무시되는 문자열 리터럴이라 캐시 계층
 * (readStandingsCached)이 캐시 히트 없이 매번 평범한 함수로 실행된다. 이 성질을
 * 이용해 "캐시 실패 → 복구 경로(readStandingsFresh)" 전이를 getPremierLeagueRank
 * 호출 횟수로 검증한다. 캐시 히트/미스 자체는 이 파일로 검증할 수 없다 — 그 검증은
 * ST-01·ST-05의 next build/start 런타임 실측이 담당한다(S-16).
 *
 * DTO→Standing[] 변환(convertPLRankDTO2DAO) 자체는 별도로 완전히 커버돼 있다
 * (test/e_entities/rank/utils/convertPLRankDTO2DAO.test.ts). 이 파일은 그 변환이
 * getStandings 안에서 올바르게 호출·배선되는지만 검증하므로, 기대값은 실제 변환
 * 함수를 오라클로 삼아 계산한다(변환 로직 자체를 재작성해 중복 검증하지 않는다).
 *
 * next/cache의 cacheLife는 mock한다(getSeasonInfo.test.ts와 동일한 실측 사유):
 * 'use cache' 디렉티브는 esbuild가 무시하지만 cacheLife()는 진짜 next 런타임 함수라
 * 실제 호출되고, `cacheComponents` config가 꺼진 vitest 컨텍스트에서는 `E887`을
 * 던진다. decision-2.md H-1 수정 이후 이 호출은 캐시 계층 try 블록 **안**에 있어
 * 내부 try/catch에 잡힌다 — 그러나 mock 없이 두면 모든 테스트가 매번 복구 경로를
 * 타게 되어 호출 횟수·경고 로그 단언이 전부 무의미해진다. 그래서 여전히 mock한다.
 * src/ 변경 아님.
 *
 * [ST2-02] getStandings의 시그니처·본문은 그대로이고 React cache()로 감싸는
 * 래핑만 추가됐다(호출 지점이 StandingsPanel·SummaryPanel 2곳이 되어서 —
 * S2-4/B2-7). 아래 호출 횟수 단언이 그대로인 이유: cache()는 렌더 컨텍스트가
 * 없는 vitest에서 메모이즈 없이 원함수를 그대로 호출하므로(decision-1 S-3f의
 * 실측 근거) 호출 횟수 단언이 왜곡되지 않는다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getStandings } from '@features/rank/api';
import { getPremierLeagueRank } from '@entities/rank/api/server';
import { convertPLRankDTO2DAO } from '@entities/rank/utils';
import type { PLRankDTO } from '@entities/rank/types';
import type { ServerApiResult } from '@shared/model';

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

vi.mock('@entities/rank/api/server', () => ({
  getPremierLeagueRank: vi.fn(),
}));

const SEASON_START_YEAR = 2026;

const createPlRankDTO = (overrides: Partial<PLRankDTO> = {}): PLRankDTO => ({
  season: '2026-27',
  ranks: [
    {
      rank: 1,
      teamId: 33,
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
    },
  ],
  ...overrides,
});

const successResult = (dto: PLRankDTO): ServerApiResult<PLRankDTO> => ({
  isSuccess: true,
  status: 200,
  data: dto,
});

const failureResult = (): ServerApiResult<PLRankDTO> => ({
  isSuccess: false,
  status: 502,
  data: { code: 'UPSTREAM_ERROR', message: '업스트림 오류' },
});

describe('getStandings', () => {
  beforeEach(() => {
    vi.mocked(getPremierLeagueRank).mockReset();
  });

  it('조회가 성공하면 convertPLRankDTO2DAO 변환 결과를 반환하고 { season }을 인자로 1회 호출한다', async () => {
    const dto = createPlRankDTO();
    vi.mocked(getPremierLeagueRank).mockResolvedValue(successResult(dto));

    const standings = await getStandings(SEASON_START_YEAR);

    expect(standings).toEqual(convertPLRankDTO2DAO(dto));
    expect(getPremierLeagueRank).toHaveBeenCalledTimes(1);
    expect(getPremierLeagueRank).toHaveBeenCalledWith({
      season: SEASON_START_YEAR,
    });
  });

  it('1차 조회가 실패하고 2차(복구) 조회가 성공하면 복구 값을 반환하고 두 호출 모두 동일한 season 인자로 호출된다', async () => {
    const recoveredDto = createPlRankDTO({ season: '2026-27' });
    vi.mocked(getPremierLeagueRank)
      .mockResolvedValueOnce(failureResult())
      .mockResolvedValueOnce(successResult(recoveredDto));

    const standings = await getStandings(SEASON_START_YEAR);

    expect(standings).toEqual(convertPLRankDTO2DAO(recoveredDto));
    expect(getPremierLeagueRank).toHaveBeenCalledTimes(2);
    expect(getPremierLeagueRank).toHaveBeenNthCalledWith(1, {
      season: SEASON_START_YEAR,
    });
    expect(getPremierLeagueRank).toHaveBeenNthCalledWith(2, {
      season: SEASON_START_YEAR,
    });
  });

  it('1차·2차 모두 실패하면 null을 반환하고 throw하지 않으며 console.warn이 1회 호출된다', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(getPremierLeagueRank).mockResolvedValue(failureResult());

    await expect(getStandings(SEASON_START_YEAR)).resolves.toBeNull();
    expect(getPremierLeagueRank).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/^\[season-cache-recovery\]/);

    warnSpy.mockRestore();
  });

  it('getPremierLeagueRank가 예외를 던져도 null을 반환한다', async () => {
    vi.mocked(getPremierLeagueRank).mockRejectedValue(
      new Error('network down')
    );

    await expect(getStandings(SEASON_START_YEAR)).resolves.toBeNull();
    expect(getPremierLeagueRank).toHaveBeenCalledTimes(2);
  });

  it('조회는 성공했으나 form에 W/D/L 외 문자가 있어 변환이 실패하면 null을 반환하고, [season-data-convert]로 로깅하며, [season-cache-recovery]는 찍지 않는다(M-5)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const invalidFormDto = createPlRankDTO({
      ranks: [
        {
          rank: 1,
          teamId: 33,
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
          form: 'WWD N',
        },
      ],
    });
    vi.mocked(getPremierLeagueRank).mockResolvedValue(
      successResult(invalidFormDto)
    );

    await expect(getStandings(SEASON_START_YEAR)).resolves.toBeNull();

    expect(getPremierLeagueRank).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/^\[season-data-convert\]/);
    expect(warnSpy.mock.calls[0][0]).not.toMatch(/^\[season-cache-recovery\]/);

    warnSpy.mockRestore();
  });

  it('1차 응답의 form이 손상돼 변환이 실패해도, 2차(복구) 응답의 form이 정상이면 복구 값을 반환한다(자가 복구 경로 유지)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const invalidFormDto = createPlRankDTO({
      ranks: [
        {
          rank: 1,
          teamId: 33,
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
          form: 'WWD N',
        },
      ],
    });
    const recoveredDto = createPlRankDTO({
      ranks: [{ ...invalidFormDto.ranks[0], form: 'WWDWL' }],
    });

    vi.mocked(getPremierLeagueRank)
      .mockResolvedValueOnce(successResult(invalidFormDto))
      .mockResolvedValueOnce(successResult(recoveredDto));

    const standings = await getStandings(SEASON_START_YEAR);

    expect(standings).toEqual(convertPLRankDTO2DAO(recoveredDto));
    expect(getPremierLeagueRank).toHaveBeenCalledTimes(2);

    warnSpy.mockRestore();
  });
});
