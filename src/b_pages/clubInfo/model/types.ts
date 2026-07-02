/**
 * Club info page domain types.
 *
 * These are model-layer types, not component prop types.
 * Component props are defined per-section under ui/{Section} — keep them separate (code-quality.md).
 *
 * Field names mirror the design source's `window.CLUB_DATA` (club-data.js) 1:1 —
 * see `.design-ref/club-data.js` in the harness project (manu-united-club) and
 * result-ST-001.md for the reconciliation note. Short keys (en·nm·nat·p/w/d/l …)
 * are kept verbatim from the source rather than translated, per coordinator
 * instruction; each is documented below.
 */

// ───────── Identity ─────────

/** Mirrors `CLUB_DATA.identity`. Consumed by ClubHeader. */
export interface ClubIdentity {
  /** Korean club name, e.g. "맨체스터 유나이티드 FC". */
  name: string;
  /** English club name. */
  en: string;
  /** Fan nickname, bilingual, e.g. "The Red Devils · 붉은 악마". */
  nickname: string;
  /** Founding year as displayed text (source keeps this as a string, not a number). */
  founded: string;
  /** Crest code shown in the header watermark, e.g. "MUN". */
  crest: string;
}

// ───────── Summary ─────────

/**
 * A single summary stat card (8 total): 창단연도·연고지·홈구장·리그·구단주·감독·UEFA랭킹·시즌순위.
 * Mirrors `CLUB_DATA.summary[i]`.
 */
export interface SummaryCard {
  /** Lucide icon name (e.g. "History", "MapPin") — resolved to a ReactNode by SummaryCards. */
  icon: string;
  /** Korean label. */
  label: string;
  /** English label, rendered alongside `label` (e.g. "창단연도 · Founded"). */
  en: string;
  value: string;
  sub: string;
}

// ───────── History ─────────

/**
 * A single timeline entry (10 total). Mirrors `CLUB_DATA.history[i]`.
 * `year` is a display string — the final entry uses the literal value `"현재"`.
 */
export interface HistoryEvent {
  year: string;
  title: string;
  desc: string;
  /** Badge label shown when the entry is not the "현재" entry, e.g. "창단", "전환점". */
  tag: string;
  /** True for uefa/league-title milestones — renders a trophy icon (1968·1999·2008). */
  trophy?: boolean;
  /** True for the single in-progress entry — renders a "현재" live badge instead of `tag`. */
  now?: boolean;
}

// ───────── Manager ─────────

/** Career record tallies. Mirrors `CLUB_DATA.manager.record` — `{ p, w, d, l }` verbatim. */
export interface ManagerRecord {
  /** Played. */
  p: number;
  /** Won. */
  w: number;
  /** Drawn. */
  d: number;
  /** Lost. */
  l: number;
}

/**
 * Mirrors `CLUB_DATA.manager`. Win rate (`w / p`) is NOT stored — ManagerTab derives it
 * at render time from `record` (architecture.decisions "파생 상태는 렌더 중 계산").
 */
export interface Manager {
  name: string;
  en: string;
  /** Nationality, Korean display text, e.g. "포르투갈". */
  nat: string;
  /** Flag lookup code for the Flag component/icons.jsx FLAGS map, e.g. "pt". */
  flag: string;
  /** Role label, e.g. "감독 · Head Coach". */
  role: string;
  appointed: string;
  contract: string;
  age: string;
  /** Preferred formation — reuses FormationName since the value is always one of the 4. */
  preferred: FormationName;
  /** Tactical style chips (3). */
  style: string[];
  record: ManagerRecord;
  /** Previous clubs managed (3), joined with " · " for display. */
  prevClubs: string[];
}

// ───────── Stadium ─────────

/** A single stadium fact-grid entry (4 total). Mirrors `CLUB_DATA.stadium.facts[i]`. */
export interface StadiumFact {
  icon: string;
  label: string;
  value: string;
}

/** Mirrors `CLUB_DATA.stadium`. */
export interface Stadium {
  name: string;
  en: string;
  nickname: string;
  opened: string;
  capacity: string;
  address: string;
  /** Pitch dimensions display string, e.g. "105m × 68m". */
  pitch: string;
  /** Attendance record display string, e.g. "76,962명 (1939)". */
  record: string;
  facts: StadiumFact[];
}

// ───────── Squad ─────────

/**
 * Domain type for a squad member (starter or substitute).
 * Mirrors `CLUB_DATA.lineup[i]` / `CLUB_DATA.subs[i]` — `num`/`nm`/`en`/`role` verbatim.
 */
export interface SquadPlayer {
  /** Jersey number — unique within the squad, usable as a React key. */
  num: number;
  /** Korean display name (may include a marker, e.g. "브루누 (C)" for captain). */
  nm: string;
  /** English display name. */
  en: string;
  /** Position code, e.g. "GK", "RB", "CM", "AM", "ST". */
  role: string;
}

// ───────── Formation ─────────

export type FormationName = '4-3-3' | '4-2-3-1' | '4-4-2' | '3-4-2-1';

/**
 * A single pitch coordinate. x/y are percentages (0–100).
 * x: 0 = left, 100 = right. y: 0 = attacking end, 100 = own goal / GK end.
 * Mirrors a `CLUB_DATA.formations[name][i]` `[x, y]` pair.
 */
export interface FormationCoordinate {
  x: number;
  y: number;
}

/**
 * `FORMATIONS[name]` is an array of exactly 11 coordinates, ordered to pair by
 * index with `lineup` (starters) — `lineup[i]` renders at `FORMATIONS[name][i]`.
 * See `.design-ref/club-data.js` comment: "11 players assigned in order to each
 * formation's 11 slots".
 */
export type FormationCoordinates = Record<FormationName, FormationCoordinate[]>;

// ───────── Sub tabs ─────────

export type SubTabId = 'history' | 'highlights' | 'squad' | 'manager' | 'stadium' | 'stats';

/** Mirrors the `TABS` constant in club.jsx (component-local, not in club-data.js). */
export interface SubTabMeta {
  id: SubTabId;
  /** Korean label. */
  kr: string;
  /** English label. */
  en: string;
  /** True for tabs rendered via EmptyTab (하이라이트·팀통계). */
  soon?: boolean;
}

/**
 * Copy for a `soon` sub tab's EmptyTab. Not present in club-data.js (EmptyTab's
 * call-site data wasn't in the captured design source) — see result-ST-001.md.
 */
export interface EmptyTabCopy {
  /** Lucide icon name. */
  icon: string;
  desc: string;
}
