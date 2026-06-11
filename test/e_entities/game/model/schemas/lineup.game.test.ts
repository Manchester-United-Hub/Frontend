import { describe, it, expect } from 'vitest';
import { lineupSchema } from '@entities/game/model';

const {
  CoachDTOSchema,
  EventDTOSchema,
  LineupDTOSchema,
  LiveGameLineupDTOSchema,
  PastGameDetailDTOSchema,
  PlayerDTOSchema,
  StartPlayerDTOSchema,
  SubstituteDTOSchema,
  TeamDTOSchema: LineTeamDTOSchema,
} = lineupSchema;

const validTeam = {
  teamId: 33,
  name: 'Manchester United',
  logo: 'https://example.com/logo.png',
};
const validCoach = {
  coachId: 1,
  name: 'Ruben Amorim',
  photo: 'https://example.com/coach.png',
};
const validPlayer = {
  playerId: 10,
  name: 'Marcus Rashford',
  number: 10,
  position: 'FW',
};

const validStartPlayer = { ...validPlayer, grid: '1:1' };
const validSubstitute = { ...validPlayer, grid: null };
const validLineup = {
  team: validTeam,
  formation: '4-2-3-1',
  coach: validCoach,
  startPlayers: [validStartPlayer],
  substitutes: [validSubstitute],
};
const validEventPlayer = {
  ...validPlayer,
  number: null,
  position: null,
  grid: null,
};
const validEvent = {
  elapsed: 45,
  extra: 0,
  team: validTeam,
  type: 'Goal',
  detail: 'Normal Goal',
  player: validEventPlayer,
  assist: validEventPlayer,
  comments: '',
};

describe('TeamDTOSchema (lineup)', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(LineTeamDTOSchema.safeParse(validTeam).success).toBe(true);
  });
  it('logo가 유효한 URL이 아니면 실패한다', () => {
    expect(
      LineTeamDTOSchema.safeParse({ ...validTeam, logo: 'invalid' }).success
    ).toBe(false);
  });
});

describe('CoachDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(CoachDTOSchema.safeParse(validCoach).success).toBe(true);
  });
  it('coachId가 없으면 실패한다', () => {
    const { coachId: _, ...rest } = validCoach;
    expect(CoachDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('PlayerDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(PlayerDTOSchema.safeParse(validPlayer).success).toBe(true);
  });
});

describe('StartPlayerDTOSchema', () => {
  it('grid가 있으면 통과한다', () => {
    expect(StartPlayerDTOSchema.safeParse(validStartPlayer).success).toBe(true);
  });
  it('grid가 없으면 실패한다', () => {
    expect(StartPlayerDTOSchema.safeParse(validPlayer).success).toBe(false);
  });
});

describe('SubstituteDTOSchema', () => {
  it('grid가 null이면 통과한다', () => {
    expect(SubstituteDTOSchema.safeParse(validSubstitute).success).toBe(true);
  });
  it('grid가 문자열이면 통과한다', () => {
    expect(
      SubstituteDTOSchema.safeParse({ ...validSubstitute, grid: '1:2' }).success
    ).toBe(true);
  });
});

describe('LineupDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(LineupDTOSchema.safeParse(validLineup).success).toBe(true);
  });
  it('startPlayers가 없으면 실패한다', () => {
    const { startPlayers: _, ...rest } = validLineup;
    expect(LineupDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('EventDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(EventDTOSchema.safeParse(validEvent).success).toBe(true);
  });
  it('elapsed가 없으면 실패한다', () => {
    const { elapsed: _, ...rest } = validEvent;
    expect(EventDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('PastGameDetailDTOSchema', () => {
  it('lineups와 events가 있으면 통과한다', () => {
    const data = { lineups: [validLineup], events: [validEvent] };
    expect(PastGameDetailDTOSchema.safeParse(data).success).toBe(true);
  });
  it('빈 배열이면 통과한다', () => {
    expect(
      PastGameDetailDTOSchema.safeParse({ lineups: [], events: [] }).success
    ).toBe(true);
  });
});

describe('LiveGameLineupDTOSchema', () => {
  it('fixtureId와 lineups가 있으면 통과한다', () => {
    const data = { fixtureId: 100, lineups: [validLineup] };
    expect(LiveGameLineupDTOSchema.safeParse(data).success).toBe(true);
  });
  it('fixtureId가 없으면 실패한다', () => {
    expect(LiveGameLineupDTOSchema.safeParse({ lineups: [] }).success).toBe(
      false
    );
  });
});
