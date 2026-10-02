/**
 * Player detail page domain types.
 *
 * Rewritten for real API data (D-20/D-21/D-23/D-24/D-31, PD-3) — the
 * previous mock-derived shape (en/flag/years/birth/foot/joined/left/career/
 * trophies/status/squad/captain/legend) had no counterpart in `PlyaerDTO`
 * (`GET /api/players/{id}`) and is removed. `radar`/`ovr` are commented out
 * rather than deleted — preserved for future restoration (D-26/D-30);
 * `RadarPoint`/`AttrLevel` stay exported as-is because `AttributeCard`/
 * `AttributeBarList`/`HexRadar` still import them unchanged.
 *
 * These are model-layer types, not component prop types (code-quality.md —
 * domain types and component props stay separate). Component props are
 * defined per-section under ui/{Section}.
 */

// ───────── Player ─────────

/** D-31 — union itself is not expanded; "unknown" is expressed via `PlayerDetail.pos?`. */
export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

/** Aggregated apps/goals/assists across this season's competitions — not true career (D-21). */
export interface CareerTotals {
  apps: number;
  goals: number;
  assists: number;
}

/**
 * A single attribute-hexagon axis. Kept for `AttributeCard`/`HexRadar`/
 * `AttributeBarList`, which stay untouched (D-26/D-30) — no longer produced
 * or consumed by `PlayerDetail`/`PlayerDetailPage` (see `radar`/`ovr` below).
 */
export interface RadarPoint {
  k: string;
  v: number;
}

/**
 * Bio fields sourced from `PlyaerDTO` (`GET /api/players/{id}?season=`).
 * `num`/`pos`/`height`/`weight` are all nullable/optional — D-31 confirmed
 * several first-team players (not only youth) return `null` for both
 * `number` and `position`, and PD-1/PD-3 observed `height`/`weight` null
 * for youth players. `pos` stays optional rather than adding an `'UNKNOWN'`
 * union member (D-31 — don't expand `PlayerPosition`, express "unknown" via
 * optionality instead).
 *
 * `nat`/`dob`/`age` are `| null` — origin/dev's merged `PlayerDTOSchema`
 * made `birthDate`/`nationality` nullable (실측, ST-001 병합). No default
 * value is substituted; the UI layer (`PlayerInfoGrid`) renders `null` as
 * `'-'` via the existing `UNKNOWN_VALUE` convention instead.
 */
export interface PlayerDetail {
  id: number;
  /** Jersey number — nullable, render `?? '-'`. */
  num: number | null;
  nm: string;
  /** Optional — API `position` free text maps to 4 known values only (D-31). */
  pos?: PlayerPosition;
  /** Nullable per merged `PlayerDTOSchema` — render `'-'` when null. */
  nat: string | null;
  /** Date of birth, `yyyy-MM-dd` (API format, not reformatted). Nullable per merged `PlayerDTOSchema`. */
  dob: string | null;
  /** `null` when `dob` is null — age cannot be computed without a birth date. */
  age: number | null;
  /** Centimeters, digits only (no "cm" suffix — API confirmed by direct call, D-13). Nullable. */
  height: string | null;
  /** Kilograms, digits only (no "kg" suffix — API confirmed by direct call, D-13). Nullable. */
  weight: string | null;
  /** Photo URL — API provides one for every observed player (code-review M-4). Non-null per `PlyaerDTOSchema`. */
  photo: string;
  // radar: RadarPoint[];
  // ovr: number; // 능력치 — 정규화 기준 부재로 비활성화, 추후 복원 예정(D-26)
}

// ───────── Derived (model/derive.ts outputs) ─────────

/**
 * A single season-table row. D-20: the API param is a single season, so
 * each row is a *competition* within that season, not a career year —
 * `season` holds `LeagueStatisticsDTO.leagueName`.
 */
export interface SeasonRow {
  season: string;
  apps: number;
  goals: number;
  assists: number;
}

/** Current-season snapshot for CurrentSeasonCard (D-21 대표 대회 선택 규칙). */
export interface SeasonSnapshot {
  szn: string;
  title: string;
  apps: number;
  goals: number;
  assists: number;
}

/**
 * Attribute-value tier used by the UI to pick a token color. Logic
 * (`getAttrLevel`) and token mapping stay separate (architecture.standards).
 * Kept for `AttributeBarList`/`HexRadar`/`attrLevelColor.ts` (D-26/D-30).
 */
export type AttrLevel = 'high' | 'mid' | 'low';
