/**
 * Player list page mock data (ST-2).
 *
 * Based on design reference players-data.js (18명 — 1군 12 + 레전드 6).
 * No imports from e_entities / d_features / app/api (standards: e_entities 실 API 호출 금지 —
 * 목업은 이 파일에만 둔다).
 */

import { ALL_FILTER_KEY } from './types';
import type { FilterOption, PlayerListItem } from './types';

/** 새로고침 로딩 시뮬레이션 지연(ms) — ADR-8. API 연결 시 react-query isFetching으로 교체. */
export const REFRESH_DELAY_MS = 700;

// ───────── Players ─────────

export const PLAYERS: PlayerListItem[] = [
  // ---------- current first team ----------
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
    id: 'rashford',
    number: 10,
    name: '마커스 래시포드',
    nameEn: 'Marcus Rashford',
    position: 'FW',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2015–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'hojlund',
    number: 11,
    name: '라스무스 회일룬',
    nameEn: 'Rasmus Højlund',
    position: 'FW',
    nationality: '덴마크',
    flagCode: 'dk',
    years: '2023–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'mainoo',
    number: 37,
    name: '코비 메이누',
    nameEn: 'Kobbie Mainoo',
    position: 'MF',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2023–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'martinez',
    number: 6,
    name: '리산드로 마르티네스',
    nameEn: 'Lisandro Martínez',
    position: 'DF',
    nationality: '아르헨티나',
    flagCode: 'ar',
    years: '2022–현재',
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
    id: 'dalot',
    number: 20,
    name: '디오구 달롯',
    nameEn: 'Diogo Dalot',
    position: 'DF',
    nationality: '포르투갈',
    flagCode: 'pt',
    years: '2018–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'shaw',
    number: 23,
    name: '루크 쇼',
    nameEn: 'Luke Shaw',
    position: 'DF',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2014–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'casemiro',
    number: 18,
    name: '카세미루',
    nameEn: 'Casemiro',
    position: 'MF',
    nationality: '브라질',
    flagCode: 'br',
    years: '2022–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'deligt',
    number: 4,
    name: '마테이스 더 리흐트',
    nameEn: 'Matthijs de Ligt',
    position: 'DF',
    nationality: '네덜란드',
    flagCode: 'nl',
    years: '2024–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'garnacho',
    number: 17,
    name: '알레한드로 가르나초',
    nameEn: 'Alejandro Garnacho',
    position: 'FW',
    nationality: '아르헨티나',
    flagCode: 'ar',
    years: '2020–현재',
    status: 'active',
    squad: '1군',
  },
  {
    id: 'mount',
    number: 7,
    name: '메이슨 마운트',
    nameEn: 'Mason Mount',
    position: 'MF',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '2023–현재',
    status: 'active',
    squad: '1군',
  },

  // ---------- legends (retired) ----------
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
  {
    id: 'scholes',
    number: 18,
    name: '폴 스콜스',
    nameEn: 'Paul Scholes',
    position: 'MF',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '1994–2013',
    status: 'retired',
    squad: '레전드',
  },
  {
    id: 'beckham',
    number: 7,
    name: '데이비드 베컴',
    nameEn: 'David Beckham',
    position: 'MF',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '1992–2003',
    status: 'retired',
    squad: '레전드',
  },
  {
    id: 'cantona',
    number: 7,
    name: '에리크 캉토나',
    nameEn: 'Eric Cantona',
    position: 'FW',
    nationality: '프랑스',
    flagCode: 'fr',
    years: '1992–1997',
    status: 'retired',
    squad: '레전드',
  },
  {
    id: 'gneville',
    number: 2,
    name: '게리 네빌',
    nameEn: 'Gary Neville',
    position: 'DF',
    nationality: '잉글랜드',
    flagCode: 'gb',
    years: '1992–2011',
    status: 'retired',
    squad: '레전드',
  },
];

// ───────── Filter options ─────────

export const POSITIONS: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체' },
  { key: 'GK', label: '골키퍼 · GK' },
  { key: 'DF', label: '수비수 · DF' },
  { key: 'MF', label: '미드필더 · MF' },
  { key: 'FW', label: '공격수 · FW' },
];

/** 활약연도(decade) — filterPlayers의 decade 매칭 규칙(ADR-6)과 key를 공유한다. */
export const DECADES: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체 연도' },
  { key: '2020', label: '2020년대' },
  { key: '2010', label: '2010년대' },
  { key: '2000', label: '2000년대' },
  { key: '1990', label: '1990년대' },
];

export const SQUADS: FilterOption[] = [
  { key: ALL_FILTER_KEY, label: '전체 스쿼드' },
  { key: '1군', label: '1군' },
  { key: '레전드', label: '레전드' },
];

// ───────── Flags ─────────

/**
 * flagCode → emoji 매핑 (ADR-4). 국가명 텍스트가 접근성을 담당하므로 이 값은 소비처에서
 * aria-hidden으로 렌더한다. 웨일스(wa)는 국가가 아닌 subdivision emoji를 사용.
 */
export const FLAG_EMOJI: Record<string, string> = {
  pt: '🇵🇹',
  gb: '🇬🇧',
  dk: '🇩🇰',
  ar: '🇦🇷',
  cm: '🇨🇲',
  nl: '🇳🇱',
  br: '🇧🇷',
  fr: '🇫🇷',
  wa: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
};
