import type { CareerDTO, CoachDTO } from '@entities/coach/model';

import type { Manager, ManagerCareerEntry } from './types';

const EMPTY_VALUE = '-';
const MANAGER_ROLE = '감독 · Head Coach';
const CURRENT_PERIOD_END = '현재';

/** "YYYY-MM-DD"를 문자열 분해로 읽는다 — new Date의 타임존 영향을 피한다. */
const splitDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return { year, month, day };
};

const formatYearMonth = (date: string | null): string => {
  if (!date) return EMPTY_VALUE;
  const { year, month } = splitDate(date);
  return `${year}년 ${Number(month)}월`;
};

const formatFullDate = (date: string | null): string => {
  if (!date) return EMPTY_VALUE;
  const { year, month, day } = splitDate(date);
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const formatContractEnd = (date: string | null): string => {
  if (!date) return EMPTY_VALUE;
  return `${formatYearMonth(date)}까지`;
};

const formatPeriodPoint = (date: string): string => {
  const { year, month } = splitDate(date);
  return `${year}.${month}`;
};

const toCareerEntry = (career: CareerDTO): ManagerCareerEntry => {
  const end = career.endDate ? formatPeriodPoint(career.endDate) : CURRENT_PERIOD_END;
  return {
    team: career.team,
    period: `${formatPeriodPoint(career.startDate)} – ${end}`,
    now: career.endDate === null,
  };
};

const sortByLatest = (careers: CareerDTO[]): CareerDTO[] =>
  careers.toSorted((a, b) => b.startDate.localeCompare(a.startDate));

const mapCoachToManager = (coach: CoachDTO): Manager => ({
  name: coach.name,
  photo: coach.photo,
  role: MANAGER_ROLE,
  appointed: formatYearMonth(coach.appointmentDate),
  born: formatFullDate(coach.birthDate),
  birthplace: coach.birthPlace ?? EMPTY_VALUE,
  contract: formatContractEnd(coach.contractEndDate),
  nationality: coach.nationality ?? EMPTY_VALUE,
  careers: sortByLatest(coach.careers).map(toCareerEntry),
});

export { mapCoachToManager };
