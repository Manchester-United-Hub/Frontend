import type { SeasonSummaryCard, SubTabMeta, ZoneLegendItem } from './types';

// ───────── Season summary (4) ─────────

export const seasonSummaryCards: SeasonSummaryCard[] = [
  {
    icon: 'BarChart3',
    label: '리그 순위',
    en: 'Position',
    value: '8위',
    sub: '프리미어리그',
  },
  { icon: 'Star', label: '승점', en: 'Points', value: '47', sub: '29경기' },
  {
    icon: 'Target',
    label: '득실차',
    en: 'Goal Diff',
    value: '+7',
    sub: '45득점 38실점',
  },
  {
    icon: 'Trophy',
    label: '잔여 대회',
    en: 'Active',
    value: '3개',
    sub: '리그·FA컵·UCL',
  },
];

// ───────── Zone legend (4) ─────────

export const zoneLegend: ZoneLegendItem[] = [
  { zone: 'ucl', label: '챔피언스리그' },
  { zone: 'uel', label: '유로파리그' },
  { zone: 'conf', label: '컨퍼런스리그' },
  { zone: 'releg', label: '강등권' },
];

// ───────── Sub tabs ─────────
// Mirrors season.jsx's sub-tab nav (일정 & 결과 / 순위표). `en` labels are not
// given verbatim by season-data.js — chosen for this migration (result-ST-01.md).

export const subTabs: SubTabMeta[] = [
  { id: 'matches', kr: '일정 & 결과', en: 'Matches' },
  { id: 'table', kr: '순위표', en: 'Table' },
];
