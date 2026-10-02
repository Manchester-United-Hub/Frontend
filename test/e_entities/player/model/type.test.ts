import { describe, it, expect } from 'vitest';
import {
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
} from '@entities/player/model';
import { BASE_PLAYER_DTO, buildPlayerListDTO } from '@test/fixtures/players';

describe('PlayerListQueryDTOSchema', () => {
  it('season·page·size가 모두 없어도 통과한다(전부 선택 파라미터)', () => {
    expect(PlayerListQueryDTOSchema.safeParse({}).success).toBe(true);
  });

  it('season이 문자열이면 실패한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ season: '2024' }).success).toBe(false);
  });

  it('page는 0 이상이어야 한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ page: 0 }).success).toBe(true);
    expect(PlayerListQueryDTOSchema.safeParse({ page: -1 }).success).toBe(false);
  });

  it('size는 1 이상 100 이하여야 한다', () => {
    expect(PlayerListQueryDTOSchema.safeParse({ size: 100 }).success).toBe(true);
    expect(PlayerListQueryDTOSchema.safeParse({ size: 0 }).success).toBe(false);
    expect(PlayerListQueryDTOSchema.safeParse({ size: 101 }).success).toBe(false);
  });
});

describe('PlayerDTOSchema', () => {
  it('업스트림이 채우지 못하는 필드가 null이어도 통과한다', () => {
    const parsed = PlayerDTOSchema.safeParse({
      ...BASE_PLAYER_DTO,
      birthDate: null,
      nationality: null,
      height: null,
      weight: null,
      number: null,
      position: null,
    });

    expect(parsed.success).toBe(true);
  });

  it('seasons가 없으면 실패한다', () => {
    const withoutSeasons: Record<string, unknown> = { ...BASE_PLAYER_DTO };
    delete withoutSeasons['seasons'];

    expect(PlayerDTOSchema.safeParse(withoutSeasons).success).toBe(false);
  });
});

describe('PlayerListDTOSchema', () => {
  it('페이지 봉투를 통과시킨다', () => {
    expect(PlayerListDTOSchema.safeParse(buildPlayerListDTO([BASE_PLAYER_DTO])).success).toBe(true);
  });

  it('배열 응답은 실패한다(계약은 봉투다)', () => {
    expect(PlayerListDTOSchema.safeParse([BASE_PLAYER_DTO]).success).toBe(false);
  });
});
