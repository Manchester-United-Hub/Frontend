import { describe, it, expect } from 'vitest';
import {
  VenueDTOSchema,
  TeamDTOSchema,
  ScoreDTOSchema,
  GameScheduleDTOSchema,
  GameScheduleListDTOSchema,
  GameDetailsQueryDTOSchema,
} from '@entities/game/model/schemas/schedule.game';

const validVenue = { name: 'Old Trafford', city: 'Manchester' };
const validTeam = {
  teamId: 33,
  name: 'Manchester United',
  logo: 'https://example.com/logo.png',
  winner: true,
};
const validScore = { home: 2, away: 1 };
const validSchedule = {
  fixtureId: 100,
  date: '2024-01-15T20:00',
  venue: validVenue,
  homeTeam: validTeam,
  AwayTeam: { ...validTeam, winner: false },
  score: validScore,
};

describe('VenueDTOSchema', () => {
  it('name과 city가 있으면 통과한다', () => {
    expect(VenueDTOSchema.safeParse(validVenue).success).toBe(true);
  });
  it('name이 없으면 실패한다', () => {
    expect(VenueDTOSchema.safeParse({ city: 'Manchester' }).success).toBe(false);
  });
  it('city가 없으면 실패한다', () => {
    expect(VenueDTOSchema.safeParse({ name: 'Old Trafford' }).success).toBe(false);
  });
});

describe('TeamDTOSchema (schedule)', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(TeamDTOSchema.safeParse(validTeam).success).toBe(true);
  });
  it('logo가 유효한 URL이 아니면 실패한다', () => {
    expect(TeamDTOSchema.safeParse({ ...validTeam, logo: 'not-a-url' }).success).toBe(false);
  });
});

describe('ScoreDTOSchema', () => {
  it('home과 away가 숫자이면 통과한다', () => {
    expect(ScoreDTOSchema.safeParse(validScore).success).toBe(true);
  });
  it('home과 away가 null이면 통과한다', () => {
    expect(ScoreDTOSchema.safeParse({ home: null, away: null }).success).toBe(true);
  });
  it('home이 문자열이면 실패한다', () => {
    expect(ScoreDTOSchema.safeParse({ home: '2', away: 1 }).success).toBe(false);
  });
});

describe('GameScheduleDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(GameScheduleDTOSchema.safeParse(validSchedule).success).toBe(true);
  });
  it('fixtureId가 없으면 실패한다', () => {
    const { fixtureId: _, ...rest } = validSchedule;
    expect(GameScheduleDTOSchema.safeParse(rest).success).toBe(false);
  });
  it('date가 없으면 실패한다', () => {
    const { date: _, ...rest } = validSchedule;
    expect(GameScheduleDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('GameScheduleListDTOSchema', () => {
  it('경기 배열이면 통과한다', () => {
    expect(GameScheduleListDTOSchema.safeParse([validSchedule]).success).toBe(true);
  });
  it('빈 배열이면 통과한다', () => {
    expect(GameScheduleListDTOSchema.safeParse([]).success).toBe(true);
  });
  it('배열이 아니면 실패한다', () => {
    expect(GameScheduleListDTOSchema.safeParse(validSchedule).success).toBe(false);
  });
});

describe('GameDetailsQueryDTOSchema', () => {
  it('fixtureId가 number이면 통과한다', () => {
    expect(GameDetailsQueryDTOSchema.safeParse({ fixtureId: 42 }).success).toBe(true);
  });
  it('fixtureId가 없으면 실패한다', () => {
    expect(GameDetailsQueryDTOSchema.safeParse({}).success).toBe(false);
  });
  it('fixtureId가 문자열이면 실패한다', () => {
    expect(GameDetailsQueryDTOSchema.safeParse({ fixtureId: '42' }).success).toBe(false);
  });
});
