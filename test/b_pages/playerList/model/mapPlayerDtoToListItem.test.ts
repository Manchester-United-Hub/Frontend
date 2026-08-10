/**
 * mapPlayerDtoToListItem 단위 테스트 (PL-2, decision-1.md D-31).
 *
 * 검증 목적:
 * - 실측 4종 position 텍스트가 정확히 매핑된다
 * - 알 수 없는/공백 변형 position은 undefined로 폴백한다(정규화·유사매칭 없음)
 * - number가 null이면 undefined로 폴백한다
 * - id는 문자열화, name/nameEn 둘 다 dto.name, status/squad는 상수 고정
 */

import { describe, it, expect } from 'vitest';

import { mapApiPositionToCode, mapPlayerDtoToListItem } from '@pages/playerList/model/mapPlayerDtoToListItem';
import type { PlyaerDTO } from '@entities/player/model';

const baseDto: PlyaerDTO = {
  id: 1485,
  name: 'Bruno Fernandes',
  birthDate: '1994-09-08',
  nationality: 'Portugal',
  height: '179 cm',
  weight: '69 kg',
  number: 8,
  position: 'Midfielder',
  photo: 'https://example.com/1485.png',
};

describe('mapApiPositionToCode', () => {
  it.each([
    ['Goalkeeper', 'GK'],
    ['Defender', 'DF'],
    ['Midfielder', 'MF'],
    ['Attacker', 'FW'],
  ] as const)('%s → %s로 매핑한다', (input, expected) => {
    expect(mapApiPositionToCode(input)).toBe(expected);
  });

  it('null이면 undefined를 반환한다', () => {
    expect(mapApiPositionToCode(null)).toBeUndefined();
  });

  it('실측 4종 외 문자열(대소문자 변형 포함)은 undefined를 반환한다(정규화 없음)', () => {
    expect(mapApiPositionToCode('midfielder')).toBeUndefined();
    expect(mapApiPositionToCode('Winger')).toBeUndefined();
    expect(mapApiPositionToCode('')).toBeUndefined();
  });
});

describe('mapPlayerDtoToListItem', () => {
  it('정상 필드를 PlayerListItem으로 변환한다', () => {
    const result = mapPlayerDtoToListItem(baseDto);

    expect(result).toEqual({
      id: '1485',
      number: 8,
      name: 'Bruno Fernandes',
      nameEn: 'Bruno Fernandes',
      position: 'MF',
      nationality: 'Portugal',
      flagCode: undefined,
      years: '',
      status: 'active',
      squad: '1군',
    });
  });

  it('number가 null인 DTO는 undefined로 변환하되 선수 자체는 그대로 노출한다(B2, 44명 전원 노출)', () => {
    // 실측 응답에서 number:null인 선수는 position도 함께 null로 오지만(result-PL-2.md §5),
    // PlyaerDTO.position 스키마는 non-null string이라(e_entities 수정 범위 밖) 여기서는 number만
    // null로 검증한다 — position:null 케이스는 mapApiPositionToCode 단위 테스트가 별도로 커버한다.
    const result = mapPlayerDtoToListItem({
      ...baseDto,
      id: 284324,
      name: 'A. Garnacho',
      number: null,
    });

    expect(result.id).toBe('284324');
    expect(result.number).toBeUndefined();
    expect(result.name).toBe('A. Garnacho');
  });
});
