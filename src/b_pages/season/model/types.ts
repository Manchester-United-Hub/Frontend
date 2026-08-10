import { Match } from '@entities/matches/model';
import { StandingZone } from '@entities/rank/model';

export interface SeasonSummaryCard {
  icon: string;
  label: string;
  en: string;
  value: string;
  sub: string;
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
