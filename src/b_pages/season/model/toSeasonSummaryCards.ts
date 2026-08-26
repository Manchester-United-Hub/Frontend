import type { Standing } from '@entities/rank/types';

import type { SeasonSummaryCard } from './types';

const SUMMARY_PLACEHOLDER_VALUE = '—';
const SUMMARY_PLACEHOLDER_SUB = '정보 없음';

const PLACEHOLDER_SUMMARY_CARDS: SeasonSummaryCard[] = [
  {
    icon: 'BarChart3',
    label: '리그 순위',
    en: 'Position',
    value: SUMMARY_PLACEHOLDER_VALUE,
    sub: SUMMARY_PLACEHOLDER_SUB,
  },
  {
    icon: 'Star',
    label: '승점',
    en: 'Points',
    value: SUMMARY_PLACEHOLDER_VALUE,
    sub: SUMMARY_PLACEHOLDER_SUB,
  },
  {
    icon: 'Target',
    label: '득실차',
    en: 'Goal Diff',
    value: SUMMARY_PLACEHOLDER_VALUE,
    sub: SUMMARY_PLACEHOLDER_SUB,
  },
  {
    icon: 'Trophy',
    label: '전적',
    en: 'Record',
    value: SUMMARY_PLACEHOLDER_VALUE,
    sub: SUMMARY_PLACEHOLDER_SUB,
  },
];

const toSeasonSummaryCards = (
  standings: Standing[] | null
): SeasonSummaryCard[] => {
  const utd = standings?.find((standing) => standing.utd);
  if (!utd) return PLACEHOLDER_SUMMARY_CARDS.map((card) => ({ ...card }));

  return [
    {
      icon: 'BarChart3',
      label: '리그 순위',
      en: 'Position',
      value: `${utd.pos}위`,
      sub: '프리미어리그',
    },
    {
      icon: 'Star',
      label: '승점',
      en: 'Points',
      value: `${utd.pts}`,
      sub: `${utd.p}경기`,
    },
    {
      icon: 'Target',
      label: '득실차',
      en: 'Goal Diff',
      // diff=0이면 '0', 음수면 '-3' — `+${diff}`를 무조건 붙이지 않는다.
      value: utd.diff > 0 ? `+${utd.diff}` : `${utd.diff}`,
      sub: `${utd.gf}득점 ${utd.ga}실점`,
    },
    {
      icon: 'Trophy',
      label: '전적',
      en: 'Record',
      value: `${utd.w}승 ${utd.d}무 ${utd.l}패`,
      sub:
        utd.p > 0
          ? `승률 ${Math.round((utd.w / utd.p) * 100)}%`
          : SUMMARY_PLACEHOLDER_SUB,
    },
  ];
};

export { toSeasonSummaryCards };
