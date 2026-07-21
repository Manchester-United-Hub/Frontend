import { Match } from '@entities/matches/model';

export interface SeasonSummaryCard {
  icon: string;
  label: string;
  en: string;
  value: string;
  sub: string;
}

export type FormResult = 'W' | 'D' | 'L';

export type StandingMovement = 'up' | 'down' | 'same';

export type StandingZone = 'ucl' | 'uel' | 'conf' | 'releg' | '';

export interface Standing {
  teamLogoUrl: string;
  pos: number;
  code: string;
  nm: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
  form: FormResult[];
  mv: StandingMovement;
  zone: StandingZone;
  utd?: boolean;
}

export interface ZoneLegendItem {
  zone: Exclude<StandingZone, ''>;

  label: string;
}

// ───────── Sub tabs ─────────

export type SubTabId = 'matches' | 'table';

export interface SubTabMeta {
  id: SubTabId;

  kr: string;

  en: string;
}

export interface MatchMonthGroup {
  month: string;
  matches: Match[];
}
