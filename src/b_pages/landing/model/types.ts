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
  /**
   * Typed Next.js route.
   * Omit when the target page does not yet exist (ADR-7).
   */
  href?: Route;
}

export interface HeroContent {
  eyebrow: string;
  /** Full headline text. The accented substring is separately identified by `accent`. */
  headline: string;
  /**
   * The accented word(s) within `headline` — rendered in a highlighted span
   * by the section component.
   */
  accent: string;
  sub: string;
  ctas: HeroCta[];
  stats: HeroStat[];
}

// ───────── Match ─────────

/**
 * Mirrors MatchCard's MatchTeam interface 1:1.
 * Fields: code / name / score? / highlight?
 */
export interface MatchItemTeam {
  code: string;
  name: string;
  score?: number;
  /** Apply United (red) crest styling. */
  highlight?: boolean;
}

/**
 * Domain representation of a single match entry.
 * Aligned with MatchCard props so section components can pass fields directly.
 */
export interface MatchItem {
  variant: 'next' | 'past';
  /** Tag label shown at the top of the card, e.g. "최근 경기". */
  tag: string;
  competition: string;
  home: MatchItemTeam;
  away: MatchItemTeam;
  /** Match result — present for past matches only. */
  result?: 'W' | 'D' | 'L';
  venue: string;
  date: string;
  /** Optional kickoff time for upcoming matches, e.g. "23:30 KST". */
  time?: string;
  /**
   * Countdown label for upcoming matches, e.g. "D-3".
   * Rendered in the MatchCard action slot via a Badge component.
   */
  countdown?: string;
}

export type MatchStripStatus = 'ready' | 'loading' | 'empty' | 'error';

// ───────── Category ─────────

/**
 * Domain type for a hub category tile.
 *
 * Icon is NOT stored here — the section component resolves it from `key`
 * to keep data and presentation separate.
 */
export interface CategoryItem {
  /**
   * String identifier used by the section component to map to a lucide icon node.
   * E.g. "season" → <CalendarDays />.
   */
  key: string;
  name: string;
  nameEn: string;
  description: string;
  /**
   * Typed Next.js route.
   * Omit when the target page does not yet exist (ADR-7).
   */
  href?: Route;
}

// ───────── Player ─────────

/** Domain type for a squad member — covers both active and retired players. */
export interface PlayerItem {
  number: number;
  name: string;
  nameEn: string;
  /** Position code, e.g. "MF" or "FW". */
  position: string;
  status: 'active' | 'retired';
  /**
   * Tenure string, e.g. "2020–현재" or "2004–2017".
   * Passed as the `meta` prop to PlayerCard.
   */
  years: string;
  nationality: string;
}
