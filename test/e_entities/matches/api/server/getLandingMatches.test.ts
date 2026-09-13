/**
 * getLandingMatches 단위 테스트. getSchedule.test.ts와 동일한 형태 — 'use cache'가
 * 없는 평범한 단일 함수라 캐시 히트/미스 검증이 필요 없다.
 *
 * season은 getSeasonInfo().startYear로 확정한다(ST-004 명세). getSeasonInfo는 자체
 * 캐시 경계 안에서 절대 throw하지 않지만(getSeasonInfo.ts 주석), getLandingMatches는
 * 방어적으로 같은 try/catch 경계 안에 두므로 그 실측도 이 파일에서 커버한다.
 *
 * 선별·변환(pickLandingMatches·convertMatchesDTO2DAO)은 각각 별도로 커버돼 있다
 * (test/e_entities/matches/utils/pickLandingMatches.test.ts,
 * test/e_entities/matches/utils/convertMatchesDTO2DAO.test.ts). 이 파일은 그 두
 * 함수가 getLandingMatches 안에서 올바르게 배선되는지만 검증하므로, 기대값은 실제
 * 함수를 오라클로 삼아 계산한다.
 *
 * T-4(High-2 재작업, D-11)만 예외다 — misorder DTO를 실제 convertMatchesDTO2DAO에 통과시켜
 * idx0이 아닌 항목이 next로 뽑히는 경로 자체를 검증해야 하므로, 기대값을 같은 함수로
 * 계산하면(오라클) 배선 실수 외의 회귀를 못 잡는다. id·countdown을 리터럴로 고정한다.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getLandingMatches } from '@entities/matches/api/server/getLandingMatches';
import { fetchMatchScheduleList } from '@entities/matches/api/server/matchScheduleList';
import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import { convertMatchesDTO2DAO, pickLandingMatches } from '@entities/matches/utils';
import type { MatchScheduleListDTO } from '@entities/matches/types';
import type { ServerApiResult } from '@shared/model';
import type { SeasonInfo } from '@entities/seasonInfo/api/server';

vi.mock('@entities/matches/api/server/matchScheduleList', () => ({
  fetchMatchScheduleList: vi.fn(),
}));

vi.mock('@entities/seasonInfo/api/server', () => ({
  getSeasonInfo: vi.fn(),
}));

const SEASON_START_YEAR = 2026;

const SEASON_INFO: SeasonInfo = {
  startYear: SEASON_START_YEAR,
  label: '2026-27 시즌',
  status: 'ongoing',
};

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
  upcomingMatches: [
    {
      matchId: 2,
      date: '2026-01-10T15:00:00',
      venue: { name: '올드 트래포드', city: '맨체스터' },
      homeTeam: {
        teamId: 33,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: null,
      },
      awayTeam: {
        teamId: 35,
        name: 'Arsenal',
        logo: 'https://example.com/ars.png',
        winner: null,
      },
      score: null,
    },
  ],
};

const emptyScheduleDto: MatchScheduleListDTO = {
  pastMatches: [],
  upcomingMatches: [],
};

/**
 * T-4용 misorder DTO — idx0(matchId 2, Arsenal)이 kickoff상 더 늦은데도
 * convertMatchesDTO2DAO가 idx0에 status:'next'를 붙인다. idx1(matchId 3, Chelsea)은
 * kickoff이 더 이르지만 status:'upcoming'만 받는다. High-2 수정 후에는 kickoff이 이른
 * matchId 3이 next로 선택되고, countdown은 idx0에만 원래 붙던 필드가 아니라
 * getLandingMatches 경계에서 재계산된 값이어야 한다.
 */
const misorderedScheduleDto: MatchScheduleListDTO = {
  pastMatches: [],
  upcomingMatches: [
    {
      matchId: 2,
      date: '2026-02-20T15:00:00',
      venue: { name: '에미레이츠', city: '런던' },
      homeTeam: {
        teamId: 35,
        name: 'Arsenal',
        logo: 'https://example.com/ars.png',
        winner: null,
      },
      awayTeam: {
        teamId: 33,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: null,
      },
      score: null,
    },
    {
      matchId: 3,
      date: '2026-01-10T15:00:00',
      venue: { name: '스탬포드 브릿지', city: '런던' },
      homeTeam: {
        teamId: 34,
        name: 'Chelsea',
        logo: 'https://example.com/che.png',
        winner: null,
      },
      awayTeam: {
        teamId: 33,
        name: 'Manchester United',
        logo: 'https://example.com/mun.png',
        winner: null,
      },
      score: null,
    },
  ],
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

describe('getLandingMatches', () => {
  beforeEach(() => {
    vi.mocked(fetchMatchScheduleList).mockReset();
    vi.mocked(getSeasonInfo).mockReset();
    vi.mocked(getSeasonInfo).mockResolvedValue(SEASON_INFO);
  });

  it('getSeasonInfo().startYear를 문자열로 변환해 fetchMatchScheduleList에 전달한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(
      successResult(scheduleDto)
    );

    await getLandingMatches();

    expect(fetchMatchScheduleList).toHaveBeenCalledWith({
      season: String(SEASON_START_YEAR),
    });
  });

  it('조회가 성공하면 pickLandingMatches(convertMatchesDTO2DAO(data)) 결과를 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(
      successResult(scheduleDto)
    );

    const result = await getLandingMatches();

    expect(result).toEqual(pickLandingMatches(convertMatchesDTO2DAO(scheduleDto)));
  });

  it('일정이 비어 있으면 에러가 아니라 { recent: null, next: null }을 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(
      successResult(emptyScheduleDto)
    );

    const result = await getLandingMatches();

    expect(result).toEqual({ recent: null, next: null });
  });

  it('fetchMatchScheduleList가 실패 응답을 반환하면 null을 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockResolvedValue(failureResult());

    await expect(getLandingMatches()).resolves.toBeNull();
  });

  it('fetchMatchScheduleList가 예외를 던져도 null을 반환한다', async () => {
    vi.mocked(fetchMatchScheduleList).mockRejectedValue(
      new Error('network down')
    );

    await expect(getLandingMatches()).resolves.toBeNull();
  });

  it('getSeasonInfo가 예외를 던져도 null을 반환하고 fetchMatchScheduleList를 호출하지 않는다', async () => {
    vi.mocked(getSeasonInfo).mockRejectedValue(new Error('season down'));

    await expect(getLandingMatches()).resolves.toBeNull();
    expect(fetchMatchScheduleList).not.toHaveBeenCalled();
  });

  it('T-4 — misorder DTO에서도 kickoff이 이른 upcoming이 next로 선택되고 countdown이 재계산된다', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00'));

    try {
      vi.mocked(fetchMatchScheduleList).mockResolvedValue(
        successResult(misorderedScheduleDto)
      );

      const result = await getLandingMatches();

      // 리터럴 단언 — pickLandingMatches/convertMatchesDTO2DAO를 오라클로 쓰지 않는다.
      expect(result?.next?.id).toBe('3');
      expect(result?.next?.countdown).toBe('D-10');
    } finally {
      vi.useRealTimers();
    }
  });
});
