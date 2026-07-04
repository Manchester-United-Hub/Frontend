/**
 * filterPlayers 단위 테스트 (ST-2)
 *
 * 검증 목적:
 * - 포지션/디케이드/스쿼드 각 필터가 단독으로 정확히 동작한다
 * - 한글/영문 검색이 각각 매칭된다
 * - 여러 필터가 AND로 결합된다
 * - 조건에 맞는 선수가 없으면 빈 배열을 반환한다
 */

import { describe, it, expect } from 'vitest';

import { filterPlayers } from '@pages/playerList/model/filterPlayers';
import { ALL_FILTER_KEY } from '@pages/playerList/model/types';
import type { PlayerFilterCriteria, PlayerListItem } from '@pages/playerList/model/types';

const buildCriteria = (overrides: Partial<PlayerFilterCriteria> = {}): PlayerFilterCriteria => ({
  position: ALL_FILTER_KEY,
  decade: ALL_FILTER_KEY,
  squad: ALL_FILTER_KEY,
  query: '',
  ...overrides,
});

const players: PlayerListItem[] = [
  {
    id: 'bruno',
    number: 8,
    name: '브루누 페르난데스',
    nameEn: 'Bruno Fernandes',
    position: 'MF',
    nationality: '포르투갈',
    flagCode: 'pt',
    years: '2020–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'onana',
    number: 24,
    name: '안드레 오나나',
    nameEn: 'André Onana',
    position: 'GK',
    nationality: '카메룬',
    flagCode: 'cm',
    years: '2023–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'rooney',
    number: 10,
    name: '웨인 루니',
    nameEn: 'Wayne Rooney',
    position: 'FW',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2004–2017',
    status: 'retired',
    squad: '레전드',
  },
  {
    id: 'giggs',
    number: 11,
    name: '라이언 긱스',
    nameEn: 'Ryan Giggs',
    position: 'MF',
    nationality: '웨일스',
    flagCode: 'wa',
    years: '1990–2014',
    status: 'retired',
    squad: '레전드',
  },
];

describe('filterPlayers', () => {
  it('position 필터 — 지정한 포지션만 반환한다', () => {
    const result = filterPlayers(players, buildCriteria({ position: 'MF' }));

    expect(result.map((p) => p.id)).toEqual(['bruno', 'giggs']);
  });

  it('decade 필터 — years 시작 연도가 속한 10년 단위만 반환한다', () => {
    const result = filterPlayers(players, buildCriteria({ decade: '1990' }));

    expect(result.map((p) => p.id)).toEqual(['giggs']);
  });

  it('squad 필터 — 지정한 스쿼드만 반환한다', () => {
    const result = filterPlayers(players, buildCriteria({ squad: '레전드' }));

    expect(result.map((p) => p.id)).toEqual(['rooney', 'giggs']);
  });

  it('한글 검색 — name에 검색어가 포함되면 매칭된다', () => {
    const result = filterPlayers(players, buildCriteria({ query: '루니' }));

    expect(result.map((p) => p.id)).toEqual(['rooney']);
  });

  it('영문 검색 — nameEn을 소문자로 변환해 대소문자 무관하게 매칭된다', () => {
    const result = filterPlayers(players, buildCriteria({ query: 'GIGGS' }));

    expect(result.map((p) => p.id)).toEqual(['giggs']);
  });

  it('여러 필터가 AND로 결합된다', () => {
    const result = filterPlayers(
      players,
      buildCriteria({ position: 'MF', squad: '레전드', decade: '1990' }),
    );

    expect(result.map((p) => p.id)).toEqual(['giggs']);
  });

  it('조건에 맞는 선수가 없으면 빈 배열을 반환한다', () => {
    const result = filterPlayers(players, buildCriteria({ position: 'GK', squad: '레전드' }));

    expect(result).toEqual([]);
  });
});
