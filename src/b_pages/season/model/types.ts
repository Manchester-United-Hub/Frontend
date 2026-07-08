/**
 * Season page domain types (ST-01, 이슈 #29).
 *
 * These are model-layer (표현용) types, not component prop types.
 * Component props live under ui/{Section} — keep them separate (code-quality.md).
 *
 * Field names mirror the design source (`.state/design-ref.md` — season-data.js)
 * 1:1 where the source defines a shape (Fixture/Standing/SeasonSummaryCard). Short
 * keys (nm·p/w/d/l·gf/ga·pts·mv …) are kept verbatim from the source rather than
 * translated — see result-ST-01.md for the reconciliation note.
 *
 * No e_entities import — this page is mock-data only for issue #29 (백엔드 계약 갭:
 * design-ref.md "백엔드 계약 갭" 참조, 실 API 배선은 별도 이슈).
 */

// ───────── Season summary cards ─────────

/** A single summary stat card (4 total): 리그순위·승점·득실차·잔여대회. Mirrors SEASON_SUMMARY[i]. */
export interface SeasonSummaryCard {
  /** Lucide icon name (e.g. "BarChart3") — resolved to a ReactNode by SummaryCards. */
  icon: string;
  /** Korean label. */
  label: string;
  /** English label, rendered alongside `label`. */
  en: string;
  value: string;
  sub: string;
}

// ───────── Standings (순위표) ─────────

/** Result of a single past match, most recent last — used in `Standing.form`. */
export type FormResult = 'W' | 'D' | 'L';

/** Position change since the previous matchday. */
export type StandingMovement = 'up' | 'down' | 'same';

/** European/relegation zone a team currently sits in. `''` = no zone. */
export type StandingZone = 'ucl' | 'uel' | 'conf' | 'releg' | '';

/**
 * A single league table row. Mirrors `STANDINGS[i]`.
 * Goal difference (`gf - ga`) is intentionally NOT stored — it is a derived
 * value computed at render time (architecture.decisions "파생 상태는 렌더 중 계산").
 */
export interface Standing {
  /** League position, 1–20. */
  pos: number;
  /** Club crest code, e.g. "MUN". */
  code: string;
  /** Korean club name. */
  nm: string;
  /** Played. */
  p: number;
  /** Won. */
  w: number;
  /** Drawn. */
  d: number;
  /** Lost. */
  l: number;
  /** Goals for. */
  gf: number;
  /** Goals against. */
  ga: number;
  /** Points. */
  pts: number;
  /** Last 5 results, oldest first. */
  form: FormResult[];
  mv: StandingMovement;
  zone: StandingZone;
  /** True for the Manchester United row (renders emphasized). */
  utd?: boolean;
}

/**
 * A single zone-legend entry (4 total): ucl·uel·conf·releg. Mirrors `ZONE_LEGEND[i]`.
 * Intentionally carries no color/style value — mapping `zone` to a manuhub
 * Tailwind token (`bg-win`·`bg-united-red`·…) is a ui-layer concern, not model
 * data (code-quality.md "raw hex 금지 → 토큰"; see result-ST-01.md for the note
 * on `uel`/`conf`, which have no existing manuhub token equivalent).
 */
export interface ZoneLegendItem {
  zone: Exclude<StandingZone, ''>;
  /** Korean label, e.g. "챔피언스리그". */
  label: string;
}

// ───────── Fixtures (일정 & 결과) ─────────

/** Competition a fixture belongs to — also the value set for `CompFilter` (minus `'all'`). */
export type Competition = '프리미어리그' | 'FA컵' | '챔피언스리그';

/** Home/away/neutral venue side, used for the ha filter. */
export type FixtureHa = 'home' | 'away' | 'neutral';

/** `past` = played (score+result shown) · `next`/`upcoming` = not yet played (time/countdown shown). */
export type FixtureStatus = 'past' | 'next' | 'upcoming';

/** Match outcome from Manchester United's perspective — only present on `past` fixtures. */
export type FixtureResult = 'W' | 'D' | 'L';

/** One side of a fixture. Mirrors `Fixture.home`/`Fixture.away`. */
export interface FixtureSide {
  code: string;
  nm: string;
  /** Final score — present only when `Fixture.status === 'past'`. */
  score?: number;
  /** True for the Manchester United side (renders emphasized crest). */
  utd?: boolean;
}

/**
 * A single fixture (13 total). Mirrors `FIXTURES[i]`.
 * `month` is the design source's display grouping label verbatim (e.g. the
 * first month of the season includes the year, "2025년 3월", later months
 * are bare, "4월"/"5월") — `filterFixtures` groups by this field as-is.
 */
export interface Fixture {
  id: string;
  /** Month grouping label, verbatim from the design source. */
  month: string;
  /** Display date, e.g. "3/1". */
  date: string;
  /** Day-of-week label, e.g. "토". */
  dow: string;
  comp: Competition;
  /** Round label, e.g. "27R", "8강", "16강 1차전". */
  round: string;
  ha: FixtureHa;
  home: FixtureSide;
  away: FixtureSide;
  status: FixtureStatus;
  /** Present only when `status === 'past'`. */
  result?: FixtureResult;
  /** Kickoff time display, e.g. "23:30 KST" — present only for future fixtures. */
  time?: string;
  /** Countdown display, e.g. "D-3" — present only for the next upcoming fixture. */
  countdown?: string;
  venue: string;
}

/** Home/away filter value for the fixtures tab. */
export type HaFilter = 'all' | 'home' | 'away';

/** Competition filter value for the fixtures tab. */
export type CompFilter = 'all' | Competition;

/** `filterFixtures` output — one entry per distinct `Fixture.month`, input order preserved. */
export interface FixtureMonthGroup {
  month: string;
  fixtures: Fixture[];
}

// ───────── Sub tabs ─────────

export type SubTabId = 'fixtures' | 'table';

/** Mirrors the season page's sub-tab nav (일정 & 결과 / 순위표), 2 total. */
export interface SubTabMeta {
  id: SubTabId;
  /** Korean label. */
  kr: string;
  /** English label. */
  en: string;
}
