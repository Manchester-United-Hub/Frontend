/**
 * Landing page domain types.
 *
 * These are model-layer types, not component prop types.
 * Component props are defined in f_shared/ui — keep them separate (code-quality.md).
 *
 * NavLink is removed (ST-09): Nav 아이템 타입은 @widgets/Navbar의 NavItem으로 이전.
 */
import type { Route } from 'next';

// ───────── Hero ─────────

export interface HeroStat {
  num: string;
  unit: string;
  label: string;
}

export interface HeroCta {
  label: string;
  variant: 'red' | 'outline';
  href?: Route;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  accent: string;
  sub: string;
  ctas: HeroCta[];
  stats: HeroStat[];
}

export interface MatchItemTeam {
  code: string;
  name: string;
  score?: number;
  /** Apply United (red) crest styling. */
  highlight?: boolean;
}

export interface MatchItem {
  variant: 'next' | 'past';
  tag: string;
  competition: string;
  home: MatchItemTeam;
  away: MatchItemTeam;
  result?: 'W' | 'D' | 'L';
  venue: string;
  date: string;
  time?: string;
  countdown?: string;
}

export type MatchStripStatus = 'ready' | 'loading' | 'empty' | 'error';
