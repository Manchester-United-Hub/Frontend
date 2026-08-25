/**
 * getSchedule 단위 테스트 (decision-1.md §5 ST-09 — plan.json 원본 + 예외 케이스 1건 추가).
 *
 * getSchedule은 'use cache'가 없는 평범한 단일 함수다(3계층 구조 아님). 'use cache'가
 * vitest(esbuild) 환경에서 무시되는 문자열 리터럴이라는 사실 자체는 이 파일과 무관하다
 * (다른 계층에는 애초에 그 디렉티브가 없다) — getSeasonInfo.test.ts·getStandings.test.ts와
 * 달리 여기서는 호출 횟수 기반 복구 경로 검증이 필요 없다.
 *
 * R-10 방어: MatchScheduleParams.season은 string, PLRankParams.season은 number로 두
 * 엔티티의 시즌 파라미터 타입이 갈려 있다(A-6). getSchedule(seasonStartYear: number)이
 * fetchMatchScheduleList를 호출할 때 season이 String()으로 변환되는지 명시적으로 검증한다.
 *
 * Match[] 변환(convertMatchesDTO2DAO) 자체는 별도로 커버돼 있다
 * (test/e_entities/matches/utils/convertMatchesDTO2DAO.test.ts). 이 파일은 그 변환이
 * getSchedule 안에서 올바르게 배선되는지만 검증하므로, 기대값은 실제 변환 함수를
 * 오라클로 삼아 계산한다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getSchedule } from '@entities/matches/api/server/getSchedule';
import { fetchMatchScheduleList } from '@entities/matches/api/server/matchScheduleList';
import { convertMatchesDTO2DAO } from '@entities/matches/utils';
import type { MatchScheduleListDTO } from '@entities/matches/types';
import type { ServerApiResult } from '@shared/model';

vi.mock('@entities/matches/api/server/matchScheduleList', () => ({
  fetchMatchScheduleList: vi.fn(),
}));

const SEASON_START_YEAR = 2026;

const scheduleDto: MatchScheduleListDTO = {
  pastMatches: [
    {
      matchId: 1,
      date: '2025-08-16T15:00:00',
      venue: { name: '올드 트래포드', city: '맨체스터' },
      homeTeam: {
        teamId: 33,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: true,
      },
      awayTeam: {
        teamId: 34,
        name: 'Newcastle',
        logo: 'https://example.com/new.png',
        winner: false,
      },
      score: { home: 2, away: 0 },
    },
  ],
  upcomingMatches: [],
};

const successResult = (
  dto: MatchScheduleListDTO
): ServerApiResult<MatchScheduleListDTO> => ({
  isSuccess: true,
  status: 200,
  data: dto,
});

const failureResult = (): ServerApiResult<MatchScheduleListDTO> => ({
  isSuccess: false,
  status: 502,
  data: { code: 'UPSTREAM_ERROR', message: '업스트림 오류' },
});

describe('getSchedule', () => {
  beforeEach(() => {
    vi.mocked(fetchMatchScheduleList).mockReset();
  });

  it('seasonStartYear(number)를 문자열로 변환해 fetchMatchScheduleList에 전달한다(R-10)', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(
      successResult(scheduleDto)
    );

    await getSchedule(SEASON_START_YEAR);

    expect(fetchMatchScheduleList).toHaveBeenCalledWith({
      season: String(SEASON_START_YEAR),
    });
    expect(fetchMatchScheduleList).toHaveBeenCalledWith(
      expect.objectContaining({ season: expect.any(String) })
    );
  });

  it('조회가 성공하면 convertMatchesDTO2DAO 변환 결과(Match[])를 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(
      successResult(scheduleDto)
    );

    const matches = await getSchedule(SEASON_START_YEAR);

    expect(matches).toEqual(convertMatchesDTO2DAO(scheduleDto));
  });

  it('조회가 실패하면 null을 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(failureResult());

    await expect(getSchedule(SEASON_START_YEAR)).resolves.toBeNull();
  });

  it('fetchMatchScheduleList가 예외를 던져도 null을 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockRejectedValue(
      new Error('network down')
    );

    await expect(getSchedule(SEASON_START_YEAR)).resolves.toBeNull();
  });
});
