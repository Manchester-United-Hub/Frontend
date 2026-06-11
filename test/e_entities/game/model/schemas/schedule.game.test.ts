import { describe, it, expect } from 'vitest';
import {
  TeamDTOSchema,
  ScoreDTOSchema,
  GameScheduleListDTOSchema,
  GameDetailsQueryDTOSchema,
} from '@entities/game/model/schemas/schedule.game';

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
  venue: { name: 'Old Trafford', city: 'Manchester' },
  homeTeam: validTeam,
  AwayTeam: { ...validTeam, winner: false },
  score: validScore,
};

describe('TeamDTOSchema (schedule)', () => {
  it('logo가 유효한 URL이 아니면 실패한다', () => {
    expect(TeamDTOSchema.safeParse({ ...validTeam, logo: 'not-a-url' }).success).toBe(false);
  });
});

describe('ScoreDTOSchema', () => {
  it('home과 away가 null이면 통과한다', () => {
    expect(ScoreDTOSchema.safeParse({ home: null, away: null }).success).toBe(true);
  });
  it('home이 문자열이면 실패한다', () => {
    expect(ScoreDTOSchema.safeParse({ home: '2', away: 1 }).success).toBe(false);
  });
});

describe('GameScheduleListDTOSchema', () => {
  it('배열이 아니면 실패한다', () => {
    expect(GameScheduleListDTOSchema.safeParse(validSchedule).success).toBe(false);
  });
});

describe('GameDetailsQueryDTOSchema', () => {
  it('fixtureId가 문자열이면 실패한다', () => {
    expect(GameDetailsQueryDTOSchema.safeParse({ fixtureId: '42' }).success).toBe(false);
  });
});
