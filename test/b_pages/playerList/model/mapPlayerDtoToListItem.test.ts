/**
 * mapPlayerDtoToListItem 단위 테스트 (PL-2, decision-1.md D-31).
 *
 * 검증 목적:
 * - 실측 5종 position 텍스트가 정확히 매핑된다
 * - 알 수 없는/공백 변형 position은 undefined로 폴백한다(정규화·유사매칭 없음)
 * - number·nationality가 null이면 undefined로 폴백한다
 * - seasons가 활약연도(years) 문자열로 압축된다
 * - id는 문자열화, name/nameEn 둘 다 dto.name, status/squad는 상수 고정
 */

import { describe, it, expect } from 'vitest';

import {
  formatSeasonRange,
  mapApiPositionToCode,
  mapPlayerDtoToListItem,
} from '@pages/playerList/model/mapPlayerDtoToListItem';
import { buildPlayerDTO } from '@test/fixtures/players';

describe('mapApiPositionToCode', () => {
  it.each([
    ['Goalkeeper', 'GK'],
    ['Defender', 'DF'],
    ['Midfielder', 'MF'],
    ['Attacker', 'FW'],
    ['Forward', 'FW'],
  ] as const)('%s → %s로 매핑한다', (input, expected) => {
    expect(mapApiPositionToCode(input)).toBe(expected);
  });

  it('null이면 undefined를 반환한다', () => {
    expect(mapApiPositionToCode(null)).toBeUndefined();
  });

  it('실측 5종 외 문자열(대소문자 변형 포함)은 undefined를 반환한다(정규화 없음)', () => {
    expect(mapApiPositionToCode('midfielder')).toBeUndefined();
    expect(mapApiPositionToCode('Winger')).toBeUndefined();
    expect(mapApiPositionToCode('')).toBeUndefined();
  });
});

describe('formatSeasonRange', () => {
  it('여러 시즌은 최소–최대 범위로 압축한다', () => {
    expect(formatSeasonRange([2022, 2020, 2021])).toBe('2020–2022');
  });

  it('한 시즌만 뛰었으면 연도 하나만 반환한다', () => {
    expect(formatSeasonRange([2025])).toBe('2025');
  });

  it('빈 배열이면 빈 문자열을 반환한다', () => {
    expect(formatSeasonRange([])).toBe('');
  });
});

describe('mapPlayerDtoToListItem', () => {
  it('정상 필드를 PlayerListItem으로 변환한다', () => {
    const result = mapPlayerDtoToListItem(buildPlayerDTO());

    expect(result).toEqual({
      id: '1485',
      number: 8,
      name: 'Bruno Fernandes',
      nameEn: 'Bruno Fernandes',
      position: 'MF',
      nationality: 'Portugal',
      flagCode: undefined,
      years: '2020–2025',
      status: 'active',
      squad: '1군',
    });
  });

  it('number·position·nationality가 null인 DTO도 선수 자체는 그대로 노출한다(B2, 스쿼드 전원 노출)', () => {
    const result = mapPlayerDtoToListItem(
      buildPlayerDTO({
        id: 284324,
        name: 'A. Garnacho',
        number: null,
        position: null,
        nationality: null,
      }),
    );

    expect(result.id).toBe('284324');
    expect(result.number).toBeUndefined();
    expect(result.position).toBeUndefined();
    expect(result.nationality).toBeUndefined();
    expect(result.name).toBe('A. Garnacho');
  });
});
