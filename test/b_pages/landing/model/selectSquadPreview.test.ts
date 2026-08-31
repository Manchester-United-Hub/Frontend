/**
 * selectSquadPreview 단위 테스트 (ST-004).
 *
 * 픽스처는 @test/fixtures/players의 buildPlayerDTO·buildPlayerListDTO로 얻고, 실 컨버터
 * (mapPlayerDtoToListItem)도 함께 검증한다. 실 서버 응답값(시점 의존)은 하드코딩하지 않는다.
 *
 * 검증 목적:
 * - 등번호 오름차순 정렬
 * - number undefined(=DTO number null) 선수는 후순위
 * - 등번호 동률은 이름순
 * - number가 모두 undefined면 이름순
 * - 9명 이상이면 상위 8명만 남긴다(리터럴 8 — SQUAD_PREVIEW_COUNT는 import하지 않는다)
 * - undefined 입력 → []
 * - players 빈 배열 → []
 * - seasons 빈 배열(years==='') 무사통과
 * - 실 컨버터(mapPlayerDtoToListItem)와 동일한 필드 매핑 결과
 */

import { describe, it, expect } from 'vitest';

import { mapPlayerDtoToListItem } from '@entities/player/utils';
import { buildPlayerDTO, buildPlayerListDTO } from '@test/fixtures/players';

import { selectSquadPreview } from '@pages/landing/model/selectSquadPreview';

describe('selectSquadPreview', () => {
  it('undefined 입력이면 빈 배열을 반환한다', () => {
    expect(selectSquadPreview(undefined)).toEqual([]);
  });

  it('players가 빈 배열이면 빈 배열을 반환한다', () => {
    expect(selectSquadPreview(buildPlayerListDTO([]))).toEqual([]);
  });

  it('등번호 오름차순으로 정렬한다', () => {
    const dtos = [
      buildPlayerDTO({ id: 1, number: 20, name: 'Z' }),
      buildPlayerDTO({ id: 2, number: 5, name: 'A' }),
      buildPlayerDTO({ id: 3, number: 11, name: 'M' }),
    ];

    const result = selectSquadPreview(buildPlayerListDTO(dtos));

    expect(result.map((player) => player.number)).toEqual([5, 11, 20]);
  });

  it('number가 undefined인 선수는 번호가 있는 선수보다 뒤로 밀린다', () => {
    const dtos = [
      buildPlayerDTO({ id: 1, number: null, name: 'No Number' }),
      buildPlayerDTO({ id: 2, number: 7, name: 'Has Number' }),
    ];

    const result = selectSquadPreview(buildPlayerListDTO(dtos));

    expect(result.map((player) => player.id)).toEqual(['2', '1']);
  });

  it('등번호가 같으면 이름 오름차순으로 정렬한다', () => {
    const dtos = [
      buildPlayerDTO({ id: 1, number: 9, name: 'Zidane' }),
      buildPlayerDTO({ id: 2, number: 9, name: 'Alonso' }),
    ];

    const result = selectSquadPreview(buildPlayerListDTO(dtos));

    expect(result.map((player) => player.name)).toEqual(['Alonso', 'Zidane']);
  });

  it('number가 모두 undefined이면 이름 오름차순으로 정렬한다', () => {
    const dtos = [
      buildPlayerDTO({ id: 1, number: null, name: 'Zidane' }),
      buildPlayerDTO({ id: 2, number: null, name: 'Alonso' }),
    ];

    const result = selectSquadPreview(buildPlayerListDTO(dtos));

    expect(result.map((player) => player.name)).toEqual(['Alonso', 'Zidane']);
  });

  it('9명 이상이면 상위 8명만 남긴다', () => {
    const dtos = Array.from({ length: 9 }, (_, index) =>
      buildPlayerDTO({ id: index + 1, number: index + 1, name: `Player ${index + 1}` }),
    );

    const result = selectSquadPreview(buildPlayerListDTO(dtos));

    expect(result).toHaveLength(8);
    expect(result.map((player) => player.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('seasons가 빈 배열인 선수도 years=""로 무사히 변환된다', () => {
    const dto = buildPlayerDTO({ id: 1, seasons: [] });

    const result = selectSquadPreview(buildPlayerListDTO([dto]));

    expect(result[0]?.years).toBe('');
  });

  it('실 컨버터(mapPlayerDtoToListItem)와 동일한 필드 매핑을 거친다', () => {
    const dto = buildPlayerDTO({ id: 1 });

    const result = selectSquadPreview(buildPlayerListDTO([dto]));

    expect(result[0]).toEqual(mapPlayerDtoToListItem(dto));
  });
});
