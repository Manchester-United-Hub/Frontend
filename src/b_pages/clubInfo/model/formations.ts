/**
 * Formation pitch-coordinate tables.
 *
 * Copied verbatim from the design source `CLUB_DATA.formations` (see
 * `.design-ref/club-data.js` in the harness project, manu-united-club) — do
 * not hand-adjust these numbers, they are the design's source of truth.
 *
 * Each formation is an array of exactly 11 `[x, y]` coordinates, ordered to
 * pair by index with `lineup` (starters): `lineup[i]` renders at
 * `FORMATIONS[name][i]` (source comment: "11 players assigned in order to
 * each formation's 11 slots"). SquadPitch/useFormation (SquadTab) read this
 * table directly — switching formations swaps the data, not component state
 * (code-conventions §1: derived positions computed at render, no effect).
 *
 * x: 0–100, left → right. y: 0–100, 0 = attacking end, 100 = own goal / GK end.
 */
import type { FormationCoordinates } from './types';

export const FORMATIONS: FormationCoordinates = {
  '4-3-3': [
    { x: 50, y: 90 },
    { x: 83, y: 71 },
    { x: 62, y: 75 },
    { x: 38, y: 75 },
    { x: 17, y: 71 },
    { x: 68, y: 52 },
    { x: 50, y: 57 },
    { x: 32, y: 52 },
    { x: 80, y: 24 },
    { x: 50, y: 17 },
    { x: 20, y: 24 },
  ],
  '4-2-3-1': [
    { x: 50, y: 90 },
    { x: 83, y: 71 },
    { x: 62, y: 75 },
    { x: 38, y: 75 },
    { x: 17, y: 71 },
    { x: 62, y: 58 },
    { x: 38, y: 58 },
    { x: 78, y: 37 },
    { x: 50, y: 40 },
    { x: 22, y: 37 },
    { x: 50, y: 16 },
  ],
  '4-4-2': [
    { x: 50, y: 90 },
    { x: 84, y: 70 },
    { x: 62, y: 75 },
    { x: 38, y: 75 },
    { x: 16, y: 70 },
    { x: 85, y: 48 },
    { x: 60, y: 52 },
    { x: 40, y: 52 },
    { x: 15, y: 48 },
    { x: 60, y: 19 },
    { x: 40, y: 19 },
  ],
  '3-4-2-1': [
    { x: 50, y: 90 },
    { x: 68, y: 74 },
    { x: 50, y: 77 },
    { x: 32, y: 74 },
    { x: 86, y: 52 },
    { x: 62, y: 55 },
    { x: 38, y: 55 },
    { x: 14, y: 52 },
    { x: 64, y: 30 },
    { x: 36, y: 30 },
    { x: 50, y: 15 },
  ],
};

export const FORMATION_NAMES: (keyof FormationCoordinates)[] = [
  '4-3-3',
  '4-2-3-1',
  '4-4-2',
  '3-4-2-1',
];
