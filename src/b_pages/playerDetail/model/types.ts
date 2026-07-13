/**
 * Player detail page domain types.
 *
 * These are model-layer types, not component prop types (code-quality.md —
 * domain types and component props stay separate). Component props are
 * defined per-section under ui/{Section}.
 *
 * Field names mirror the design source's `window.PLAYERS` (players-data.js)
 * 1:1 — see plan.json architecture.interface_contracts and
 * result-ST-001.md for the reconciliation note. Short keys (nm·en·nat·dob…)
 * are kept verbatim from the source rather than translated, per the club
 * page precedent (b_pages/clubInfo/model/types.ts).
 */

// ───────── Player ─────────

export type PlayerStatus = 'active' | 'retired';

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

/** Mirrors `PLAYERS[i].career`. */
export interface CareerTotals {
  apps: number;
  goals: number;
  assists: number;
}

/**
 * A single attribute-hexagon axis (6 total per player). Mirrors
 * `PLAYERS[i].radar[i]` — `k`/`v` verbatim. Axis labels differ by position:
 * outfield `["슈팅","패스","드리블","스피드","수비","피지컬"]`, GK
 * `["반응","핸들링","킥력","위치선정","민첩성","공중장악"]`.
 */
export interface RadarPoint {
  /** Axis label (Korean), e.g. "슈팅", "반응". */
  k: string;
  /** Axis value, 0–100. */
  v: number;
}

/**
 * Mirrors `window.PLAYERS[i]` from players-data.js.
 *
 * `photo` is intentionally omitted — no consumer in
 * architecture.interface_contracts renders an actual photo image
 * (PlayerHeader always renders PlayerSilhouette), and the plan's field
 * list for PlayerDetail does not include it (Simplicity First — no field
 * beyond what's consumed). See result-ST-001.md.
 */
export interface PlayerDetail {
  /** Stable slug id, e.g. "bruno". Used as the route param and lookup key. */
  id: string;
  /** Jersey number. */
  num: number;
  /** Korean display name. */
  nm: string;
  /** English display name. */
  en: string;
  pos: PlayerPosition;
  /** Nationality, Korean display text, e.g. "포르투갈". */
  nat: string;
  /** Flag lookup code, e.g. "pt", "gb", "ar". */
  flag: string;
  /** Career span display string, e.g. "2020–현재" or "2004–2017". */
  years: string;
  /** Date of birth, display string "YYYY.MM.DD". */
  dob: string;
  age: number;
  /** Birthplace, Korean display text, e.g. "마이아, 포르투갈". */
  birth: string;
  /** Centimeters. */
  height: number;
  /** Kilograms. */
  weight: number;
  /** Preferred foot, Korean display text, e.g. "오른발". */
  foot: string;
  /** Club join date, display string "YYYY.MM.DD". */
  joined: string;
  /** Club departure date, display string, or null while still at the club. */
  left: string | null;
  career: CareerTotals;
  /** Career trophy count. */
  trophies: number;
  status: PlayerStatus;
  /** Squad label, e.g. "1군" (current) or "레전드" (legend). */
  squad: string;
  /** True only for the current captain (source: only "bruno"). */
  captain?: boolean;
  /** True for legend-status retirees, rendered with a legend badge. */
  legend?: boolean;
  /** 6-axis attribute hexagon data, position-appropriate axis labels. */
  radar: RadarPoint[];
  /** Overall rating — rounded mean of `radar[*].v`. */
  ovr: number;
}

// ───────── Derived (model/derive.ts outputs) ─────────

/** A single season-table row. Mirrors `seasonRows(p)[i]` from player-detail.jsx. */
export interface SeasonRow {
  /** Season display label, e.g. "2020/21". */
  season: string;
  apps: number;
  goals: number;
  assists: number;
}

/**
 * Current (or last, if retired) season snapshot. Mirrors `curSeason(p)`
 * from player-detail.jsx.
 */
export interface SeasonSnapshot {
  retired: boolean;
  /** Season display label, e.g. "2025/26" or a retired player's final season. */
  szn: string;
  /** Card title, e.g. "현재 시즌" or "마지막 시즌". */
  title: string;
  apps: number;
  goals: number;
  assists: number;
}

/**
 * Attribute-value tier used by the UI to pick a token color (attrColor in
 * player-detail.jsx). Logic (getAttrLevel) and token mapping stay separate —
 * see plan.json architecture.standards.
 */
export type AttrLevel = 'high' | 'mid' | 'low';
