import { describe, it, expect } from 'vitest';
import {
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
} from '@entities/player/model';

const validQuery = { season: 2024, position: 'FW' };

const validPlayer = {
  id: 1,
  name: 'Marcus Rashford',
  birthDate: '1997-10-31',
  nationality: 'England',
  height: '180cm',
  weight: '70kg',
  number: 10,
  position: 'FW',
  photo: 'https://example.com/photo.png',
};

describe('PlayerListQueryDTOSchema', () => {
  it('season과 position이 있으면 통과한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse(validQuery).success).toBe(true);
  });
  it('position이 없어도 통과한다 (optional)', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ season: 2024 }).success).toBe(true);
  });
  it('season이 없으면 실패한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ position: 'FW' }).success).toBe(false);
  });
  it('season이 문자열이면 실패한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ season: '2024' }).success).toBe(false);
  });
});

describe('PlayerDTOSchema', () => {
  it('필수 필드가 모두 있으면 통과한다', () => {
    expect(PlayerDTOSchema.safeParse(validPlayer).success).toBe(true);
  });
  it('number가 null이면 통과한다', () => {
    expect(PlayerDTOSchema.safeParse({ ...validPlayer, number: null }).success).toBe(true);
  });
  it('name이 없으면 실패한다', () => {
    const { name: _, ...rest } = validPlayer;
    expect(PlayerDTOSchema.safeParse(rest).success).toBe(false);
  });
  it('id가 없으면 실패한다', () => {
    const { id: _, ...rest } = validPlayer;
    expect(PlayerDTOSchema.safeParse(rest).success).toBe(false);
  });
});

describe('PlayerListDTOSchema', () => {
  it('players 배열이 있으면 통과한다', () => {
    expect(PlayerListDTOSchema.safeParse({ players: [validPlayer] }).success).toBe(true);
  });
  it('빈 players 배열이면 통과한다', () => {
    expect(PlayerListDTOSchema.safeParse({ players: [] }).success).toBe(true);
  });
  it('players가 없으면 실패한다', () => {
    expect(PlayerListDTOSchema.safeParse({}).success).toBe(false);
  });
});
