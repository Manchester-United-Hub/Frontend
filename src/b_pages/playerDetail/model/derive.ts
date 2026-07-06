/**
 * Deterministic derivations from `PlayerDetail`.
 *
 * The design source (player-detail.jsx) derives `seasonRows`/`curSeason` at
 * render time using `Math.random()` coefficients (e.g. `0.7 + Math.random()
 * * 0.6`) — non-deterministic and untestable. ADR-3 (plan.json) replaces
 * this with pure functions: `Math.random` is never used here.
 *
 * `deriveSeasonRows` note (implementation decision, not a plan deviation):
 * a literal reading of ADR-3 ("통산을 시즌 수로 균등 분할 + 마지막 행 잔여
 * 보정") — i.e. `Math.round(total / seasonCount)` for every row except the
 * last, which absorbs `total - sum(others)` — can go negative for players
 * with a low career stat spread over many seasons (e.g. martinez: 2 career
 * goals over 4 seasons → 3 non-last rows of `Math.round(2/4)=1` sum to 3,
 * leaving the last row `2 - 3 = -1`). To keep the "합계 = 통산" invariant
 * AND non-negative rows, each non-last row instead divides the *remaining*
 * total over the *remaining* season count (a running/cascading average) —
 * still `Math.round`-based, still deterministic, and it collapses to the
 * literal ADR-3 reading whenever the naive version wouldn't go negative.
 * Verified non-negative for every mockData.ts player (see result-ST-001.md).
 */

import type {
  AttrLevel,
  CareerTotals,
  PlayerDetail,
  SeasonRow,
  SeasonSnapshot,
} from './types';

// Mock "current year" — mirrors the literal `2026` in player-detail.jsx's
// seasonRows/curSeason. Fixed (not `Date.now()`), so deriveSeasonRows and
// deriveCurrentSeason stay pure — same player in, same rows out, always.
const CURRENT_YEAR = 2026;
const MAX_SEASON_ROWS = 8;
const CURRENT_SEASON_MAX_DIVISOR = 12;
const CURRENT_SEASON_MAX_APPS = 38;
const CURRENT_SEASON_MIN_APPS = 1;
const CURRENT_SEASON_APPS_RATIO = 0.92;
const CURRENT_SEASON_LABEL = '2025/26';
const ATTR_HIGH_THRESHOLD = 80;
const ATTR_MID_THRESHOLD = 65;

/** Career start year and season count parsed from `PlayerDetail.years` (e.g. "2020–현재"). */
interface YearRange {
  start: number;
  end: number;
  seasonCount: number;
}

function parseYearRange(years: string, seasonCap: number): YearRange {
  const start = parseInt(years.slice(0, 4), 10);
  const end = years.includes('현재')
    ? CURRENT_YEAR
    : parseInt(years.slice(-4), 10);
  const seasonCount = Math.max(1, Math.min(end - start, seasonCap));
  return { start, end, seasonCount };
}

/** Formats a season start year as a display label, e.g. 2020 → "2020/21". */
function formatSeasonLabel(startYear: number): string {
  return `${startYear}/${String(startYear + 1).slice(2)}`;
}

function buildSeasonRow(
  year: number,
  remaining: CareerTotals,
  remainingSeasons: number,
  isLastRow: boolean
): SeasonRow {
  const splitEvenly = (total: number) =>
    isLastRow ? total : Math.round(total / remainingSeasons);
  return {
    season: formatSeasonLabel(year),
    apps: splitEvenly(remaining.apps),
    goals: splitEvenly(remaining.goals),
    assists: splitEvenly(remaining.assists),
  };
}

/**
 * Splits `player.career` into per-season rows (season table). Deterministic
 * replacement for player-detail.jsx's `seasonRows(p)` — see file header for
 * the non-negative-residual note. Invariant: summing every row's
 * apps/goals/assists always equals `player.career` exactly.
 */
export function deriveSeasonRows(player: PlayerDetail): SeasonRow[] {
  const { start, seasonCount } = parseYearRange(player.years, MAX_SEASON_ROWS);
  let remaining: CareerTotals = { ...player.career };
  const rows: SeasonRow[] = [];

  for (let i = 0; i < seasonCount; i++) {
    const remainingSeasons = seasonCount - i;
    const isLastRow = remainingSeasons === 1;
    const row = buildSeasonRow(
      start + i,
      remaining,
      remainingSeasons,
      isLastRow
    );
    rows.push(row);
    remaining = {
      apps: remaining.apps - row.apps,
      goals: remaining.goals - row.goals,
      assists: remaining.assists - row.assists,
    };
  }

  return rows;
}

/**
 * Current (or, if retired, last) season snapshot for CurrentSeasonCard.
 * Deterministic port of player-detail.jsx's `curSeason(p)` — same formula,
 * `Math.random` removed (the source's curSeason had none to begin with).
 */
export function deriveCurrentSeason(player: PlayerDetail): SeasonSnapshot {
  const { seasonCount, end } = parseYearRange(
    player.years,
    CURRENT_SEASON_MAX_DIVISOR
  );
  const retired = player.status === 'retired';
  const rawApps =
    (player.career.apps / seasonCount) * CURRENT_SEASON_APPS_RATIO;
  const apps = Math.min(
    CURRENT_SEASON_MAX_APPS,
    Math.max(CURRENT_SEASON_MIN_APPS, Math.round(rawApps))
  );

  return {
    retired,
    szn: retired ? formatSeasonLabel(end - 1) : CURRENT_SEASON_LABEL,
    title: retired ? '마지막 시즌' : '현재 시즌',
    apps,
    goals: Math.round(player.career.goals / seasonCount),
    assists: Math.round(player.career.assists / seasonCount),
  };
}

/**
 * Attribute-value tier (v≥80 high / v≥65 mid / else low). Deterministic
 * port of player-detail.jsx's `attrColor(v)` — logic only, no color/token
 * knowledge (plan.json architecture.standards: UI maps level → token).
 */
export function getAttrLevel(v: number): AttrLevel {
  if (v >= ATTR_HIGH_THRESHOLD) return 'high';
  if (v >= ATTR_MID_THRESHOLD) return 'mid';
  return 'low';
}
