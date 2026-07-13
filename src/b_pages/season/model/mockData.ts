/**
 * Manchester United Hub — season page mock data (ST-01, 이슈 #29).
 *
 * Reconciled 1:1 against the design source (`.state/design-ref.md` in the
 * harness project — season.jsx + season-data.js). Values below (summary·
 * standings·zoneLegend·fixtures) are copied verbatim from that spec — do not
 * hand-edit numbers/text here without re-checking the source. `subTabs` mirrors
 * the sub-tab nav described in season.jsx (component-local, not season-data.js);
 * its `en` labels are not given verbatim by the source and were chosen for this
 * migration — see result-ST-01.md for the reconciliation note.
 *
 * Seam: this is page-local mock data for issue #29 (UI only). The real data
 * will come from `e_entities/game` (`getGameScheduleList`) and `e_entities/team`
 * (`getTeamStatistics`) — see design-ref.md "백엔드 계약 갭": neither DTO
 * currently carries `comp`/`round` (schedule) or `form`/`movement`/`zone`
 * (team statistics), so wiring the real API is a separate issue.
 *
 * No imports from e_entities / d_features / app/api (SERVICE.md 결합도 원칙).
 */

import type {
  Fixture,
  SeasonSummaryCard,
  Standing,
  SubTabMeta,
  ZoneLegendItem,
} from './types';

// ───────── Season summary (4) ─────────

export const seasonSummaryCards: SeasonSummaryCard[] = [
  { icon: 'BarChart3', label: '리그 순위', en: 'Position', value: '8위', sub: '프리미어리그' },
  { icon: 'Star', label: '승점', en: 'Points', value: '47', sub: '29경기' },
  { icon: 'Target', label: '득실차', en: 'Goal Diff', value: '+7', sub: '45득점 38실점' },
  { icon: 'Trophy', label: '잔여 대회', en: 'Active', value: '3개', sub: '리그·FA컵·UCL' },
];

// ───────── Standings (20) ─────────

export const standings: Standing[] = [
  { pos: 1, code: 'LIV', nm: '리버풀', p: 29, w: 21, d: 5, l: 3, gf: 64, ga: 26, pts: 68, form: ['W', 'W', 'W', 'D', 'W'], mv: 'same', zone: 'ucl' },
  { pos: 2, code: 'ARS', nm: '아스널', p: 29, w: 19, d: 7, l: 3, gf: 58, ga: 28, pts: 64, form: ['W', 'D', 'W', 'W', 'L'], mv: 'up', zone: 'ucl' },
  { pos: 3, code: 'MCI', nm: '맨체스터 시티', p: 29, w: 18, d: 6, l: 5, gf: 61, ga: 32, pts: 60, form: ['W', 'W', 'L', 'W', 'W'], mv: 'down', zone: 'ucl' },
  { pos: 4, code: 'CHE', nm: '첼시', p: 29, w: 16, d: 8, l: 5, gf: 54, ga: 34, pts: 56, form: ['D', 'W', 'W', 'D', 'W'], mv: 'up', zone: 'ucl' },
  { pos: 5, code: 'TOT', nm: '토트넘', p: 29, w: 16, d: 5, l: 8, gf: 57, ga: 40, pts: 53, form: ['W', 'L', 'W', 'W', 'L'], mv: 'down', zone: 'uel' },
  { pos: 6, code: 'NEW', nm: '뉴캐슬', p: 29, w: 15, d: 6, l: 8, gf: 52, ga: 38, pts: 51, form: ['W', 'W', 'D', 'L', 'W'], mv: 'up', zone: 'conf' },
  { pos: 7, code: 'AVL', nm: '아스톤 빌라', p: 29, w: 14, d: 7, l: 8, gf: 49, ga: 42, pts: 49, form: ['L', 'W', 'D', 'W', 'D'], mv: 'same', zone: '' },
  { pos: 8, code: 'MUN', nm: '맨체스터 유나이티드', p: 29, w: 13, d: 8, l: 8, gf: 45, ga: 38, pts: 47, form: ['W', 'D', 'W', 'L', 'W'], mv: 'up', zone: '', utd: true },
  { pos: 9, code: 'BHA', nm: '브라이턴', p: 29, w: 12, d: 9, l: 8, gf: 46, ga: 41, pts: 45, form: ['D', 'D', 'W', 'L', 'W'], mv: 'down', zone: '' },
  { pos: 10, code: 'BOU', nm: '본머스', p: 29, w: 12, d: 7, l: 10, gf: 44, ga: 43, pts: 43, form: ['L', 'W', 'W', 'D', 'L'], mv: 'up', zone: '' },
  { pos: 11, code: 'FUL', nm: '풀럼', p: 29, w: 11, d: 8, l: 10, gf: 40, ga: 42, pts: 41, form: ['D', 'L', 'W', 'D', 'W'], mv: 'same', zone: '' },
  { pos: 12, code: 'CRY', nm: '크리스탈 팰리스', p: 29, w: 10, d: 9, l: 10, gf: 38, ga: 40, pts: 39, form: ['W', 'D', 'L', 'D', 'W'], mv: 'up', zone: '' },
  { pos: 13, code: 'BRE', nm: '브렌트포드', p: 29, w: 10, d: 7, l: 12, gf: 43, ga: 46, pts: 37, form: ['L', 'W', 'L', 'W', 'D'], mv: 'down', zone: '' },
  { pos: 14, code: 'EVE', nm: '에버턴', p: 29, w: 9, d: 9, l: 11, gf: 34, ga: 38, pts: 36, form: ['D', 'D', 'L', 'W', 'D'], mv: 'same', zone: '' },
  { pos: 15, code: 'WHU', nm: '웨스트햄', p: 29, w: 9, d: 7, l: 13, gf: 39, ga: 48, pts: 34, form: ['L', 'L', 'W', 'D', 'L'], mv: 'down', zone: '' },
  { pos: 16, code: 'WOL', nm: '울버햄튼', p: 29, w: 8, d: 8, l: 13, gf: 36, ga: 50, pts: 32, form: ['D', 'L', 'W', 'L', 'D'], mv: 'up', zone: '' },
  { pos: 17, code: 'NFO', nm: '노팅엄 포레스트', p: 29, w: 8, d: 6, l: 15, gf: 33, ga: 47, pts: 30, form: ['L', 'W', 'L', 'L', 'D'], mv: 'down', zone: '' },
  { pos: 18, code: 'LEI', nm: '레스터 시티', p: 29, w: 6, d: 8, l: 15, gf: 30, ga: 52, pts: 26, form: ['L', 'D', 'L', 'L', 'W'], mv: 'down', zone: 'releg' },
  { pos: 19, code: 'IPS', nm: '입스위치', p: 29, w: 5, d: 7, l: 17, gf: 28, ga: 58, pts: 22, form: ['L', 'L', 'D', 'L', 'L'], mv: 'same', zone: 'releg' },
  { pos: 20, code: 'SOU', nm: '사우샘프턴', p: 29, w: 4, d: 6, l: 19, gf: 24, ga: 60, pts: 18, form: ['L', 'L', 'L', 'D', 'L'], mv: 'same', zone: 'releg' },
];

// ───────── Zone legend (4) ─────────

export const zoneLegend: ZoneLegendItem[] = [
  { zone: 'ucl', label: '챔피언스리그' },
  { zone: 'uel', label: '유로파리그' },
  { zone: 'conf', label: '컨퍼런스리그' },
  { zone: 'releg', label: '강등권' },
];

// ───────── Fixtures (13) ─────────
// month grouping is verbatim from the design source: the first month shown
// includes the season year ("2025년 3월"), later months are bare ("4월"/"5월").

export const fixtures: Fixture[] = [
  {
    id: 'f1',
    month: '2025년 3월',
    date: '3/1',
    dow: '토',
    comp: '프리미어리그',
    round: '27R',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 3, utd: true },
    away: { code: 'EVE', nm: '에버턴', score: 0 },
    status: 'past',
    result: 'W',
    venue: '올드 트래포드',
  },
  {
    id: 'f2',
    month: '2025년 3월',
    date: '3/8',
    dow: '토',
    comp: 'FA컵',
    round: '8강',
    ha: 'away',
    home: { code: 'BHA', nm: '브라이턴', score: 1 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 2, utd: true },
    status: 'past',
    result: 'W',
    venue: '아멕스 스타디움',
  },
  {
    id: 'f3',
    month: '2025년 3월',
    date: '3/15',
    dow: '토',
    comp: '프리미어리그',
    round: '29R',
    ha: 'away',
    home: { code: 'TOT', nm: '토트넘', score: 2 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 2, utd: true },
    status: 'past',
    result: 'D',
    venue: '토트넘 홋스퍼 스타디움',
  },
  {
    id: 'f4',
    month: '2025년 3월',
    date: '3/29',
    dow: '토',
    comp: '챔피언스리그',
    round: '16강1차',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 1, utd: true },
    away: { code: 'RMA', nm: '레알 마드리드', score: 1 },
    status: 'past',
    result: 'D',
    venue: '올드 트래포드',
  },
  {
    id: 'f5',
    month: '4월',
    date: '4/5',
    dow: '토',
    comp: '프리미어리그',
    round: '30R',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 2, utd: true },
    away: { code: 'NEW', nm: '뉴캐슬', score: 1 },
    status: 'past',
    result: 'W',
    venue: '올드 트래포드',
  },
  {
    id: 'f6',
    month: '4월',
    date: '4/13',
    dow: '일',
    comp: '프리미어리그',
    round: '31R',
    ha: 'away',
    home: { code: 'MCI', nm: '맨체스터 시티', score: 1 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 1, utd: true },
    status: 'past',
    result: 'D',
    venue: '에티하드 스타디움',
  },
  {
    id: 'f7',
    month: '4월',
    date: '4/20',
    dow: '일',
    comp: '챔피언스리그',
    round: '16강2차',
    ha: 'away',
    home: { code: 'RMA', nm: '레알 마드리드', score: 2 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 3, utd: true },
    status: 'past',
    result: 'W',
    venue: '산티아고 베르나베우',
  },
  {
    id: 'f8',
    month: '4월',
    date: '4/27',
    dow: '일',
    comp: '프리미어리그',
    round: '32R',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 4, utd: true },
    away: { code: 'WOL', nm: '울버햄튼', score: 0 },
    status: 'past',
    result: 'W',
    venue: '올드 트래포드',
  },
  {
    id: 'f9',
    month: '5월',
    date: '5/4',
    dow: '일',
    comp: '프리미어리그',
    round: '33R',
    ha: 'away',
    home: { code: 'ARS', nm: '아스널', score: 2 },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', score: 0, utd: true },
    status: 'past',
    result: 'L',
    venue: '에미레이츠 스타디움',
  },
  {
    id: 'f10',
    month: '5월',
    date: '5/11',
    dow: '일',
    comp: '프리미어리그',
    round: '34R',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', score: 2, utd: true },
    away: { code: 'EVE', nm: '에버턴', score: 1 },
    status: 'past',
    result: 'W',
    venue: '올드 트래포드',
  },
  {
    id: 'f11',
    month: '5월',
    date: '5/18',
    dow: '일',
    comp: '프리미어리그',
    round: '35R',
    ha: 'home',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', utd: true },
    away: { code: 'LIV', nm: '리버풀' },
    status: 'next',
    time: '23:30 KST',
    countdown: 'D-3',
    venue: '올드 트래포드',
  },
  {
    id: 'f12',
    month: '5월',
    date: '5/25',
    dow: '일',
    comp: '프리미어리그',
    round: '36R',
    ha: 'away',
    home: { code: 'CHE', nm: '첼시' },
    away: { code: 'MUN', nm: '맨체스터 유나이티드', utd: true },
    status: 'upcoming',
    time: '00:00 KST',
    venue: '스탬퍼드 브리지',
  },
  {
    id: 'f13',
    month: '5월',
    date: '5/31',
    dow: '토',
    comp: 'FA컵',
    round: '결승',
    ha: 'neutral',
    home: { code: 'MUN', nm: '맨체스터 유나이티드', utd: true },
    away: { code: 'MCI', nm: '맨체스터 시티' },
    status: 'upcoming',
    time: '01:00 KST',
    venue: '웸블리 스타디움',
  },
];

// ───────── Sub tabs ─────────
// Mirrors season.jsx's sub-tab nav (일정 & 결과 / 순위표). `en` labels are not
// given verbatim by season-data.js — chosen for this migration (result-ST-01.md).

export const subTabs: SubTabMeta[] = [
  { id: 'fixtures', kr: '일정 & 결과', en: 'Fixtures' },
  { id: 'table', kr: '순위표', en: 'Table' },
];
