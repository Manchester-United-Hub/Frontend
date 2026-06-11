import { describe, it, expect } from 'vitest';
import {
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

describe('TeamStatisticsListDTOSchema', () => {
  it('배열이 아니면 실패한다', () => {
    expect(TeamStatisticsListDTOSchema.safeParse(validStatistics).success).toBe(false);
  });
});

describe('TeamInfoParamsDTOSchema', () => {
  it('teamId가 문자열이면 실패한다', () => {
    expect(TeamInfoParamsDTOSchema.safeParse({ teamId: '33' }).success).toBe(false);
  });
});

describe('TeamInfoDTOSchema', () => {
  it('photo가 유효한 URL이 아니면 실패한다', () => {
    expect(TeamInfoDTOSchema.safeParse({ ...validTeamInfo, photo: 'not-a-url' }).success).toBe(false);
  });
});
