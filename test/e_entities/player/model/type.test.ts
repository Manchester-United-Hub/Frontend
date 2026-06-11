import { describe, it, expect } from 'vitest';
import { PlayerListQueryDTOSchema, PlayerDTOSchema } from '@entities/player/model';

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
  it('position이 없어도 통과한다 (optional)', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ season: 2024 }).success).toBe(true);
  });
  it('season이 문자열이면 실패한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ season: '2024' }).success).toBe(false);
  });
});

describe('PlayerDTOSchema', () => {
  it('number가 null이면 통과한다', () => {
    expect(PlayerDTOSchema.safeParse({ ...validPlayer, number: null }).success).toBe(true);
  });
});
