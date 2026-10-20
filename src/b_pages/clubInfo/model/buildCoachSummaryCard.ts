import type { Manager, SummaryCard } from './types';

const EMPTY_VALUE = '-';

/** 요약 카드 6장 중 감독 카드 — 감독 API 결과로 만든다. 실패(null)면 값은 "-"(설계 D-9). */
const buildCoachSummaryCard = (manager: Manager | null): SummaryCard => ({
  icon: 'User',
  label: '감독',
  en: 'COACH',
  value: manager?.name ?? EMPTY_VALUE,
  sub: manager ? `${manager.appointed} 부임` : EMPTY_VALUE,
});

export { buildCoachSummaryCard };
