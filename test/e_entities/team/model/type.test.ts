import { describe, it, expect } from 'vitest';
import {
  TeamStatisticsDTOSchema,
  TeamStatisticsListDTOSchema,
  TeamInfoParamsDTOSchema,
  TeamInfoDTOSchema,
} from '@entities/team/model';

const validStatistics = {
  teamId: 33,
  teamName: 'Manchester United',
  season: 2024,
  win: 10,
  draw: 5,
  lose: 5,
  goalsFor: 35,
  goalsAgainst: 20,
  points: 35,
  rank: 6,
};

const validTeamInfo = {
  id: 33,
  name: 'Manchester United',
  photo: 'https://example.com/logo.png',
  founded: 1878,
  location: 'Manchester',
  stadium: 'Old Trafford',
  coachName: 'Ruben Amorim',
};

describe('TeamStatisticsDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(TeamStatisticsDTOSchema.safeParse(validStatistics).success).toBe(true);
  });
  it('rank가 없으면 실패한다', () => {
    const { rank: _, ...rest } = validStatistics;
    expect(TeamStatisticsDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('TeamStatisticsListDTOSchema', () => {
  it('통계 배열이면 통과한다', () => {
    expect(TeamStatisticsListDTOSchema.safeParse([validStatistics]).success).toBe(true);
  });
  it('빈 배열이면 통과한다', () => {
    expect(TeamStatisticsListDTOSchema.safeParse([]).success).toBe(true);
  });
  it('배열이 아니면 실패한다', () => {
    expect(TeamStatisticsListDTOSchema.safeParse(validStatistics).success).toBe(false);
  });
});

describe('TeamInfoParamsDTOSchema', () => {
  it('teamId가 number이면 통과한다', () => {
    expect(TeamInfoParamsDTOSchema.safeParse({ teamId: 33 }).success).toBe(true);
  });
  it('teamId가 문자열이면 실패한다', () => {
    expect(TeamInfoParamsDTOSchema.safeParse({ teamId: '33' }).success).toBe(false);
  });
  it('teamId가 없으면 실패한다', () => {
    expect(TeamInfoParamsDTOSchema.safeParse({}).success).toBe(false);
  });
});

describe('TeamInfoDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(TeamInfoDTOSchema.safeParse(validTeamInfo).success).toBe(true);
  });
  it('photo가 유효한 URL이 아니면 실패한다', () => {
    expect(TeamInfoDTOSchema.safeParse({ ...validTeamInfo, photo: 'not-a-url' }).success).toBe(false);
  });
  it('coachName이 없으면 실패한다', () => {
    const { coachName: _, ...rest } = validTeamInfo;
    expect(TeamInfoDTOSchema.safeParse(rest).success).toBe(false);
  });
});
