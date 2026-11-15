/**
 * 라이브 경기 픽스처 — 화면 타입(LiveMatch)을 손으로 쓴 값이다.
 * 목데이터(mockData.ts)와 분리해 목데이터 수정이 테스트 기대값을 바꾸지 않게 한다.
 */

import type { LiveMatch, TeamLineup } from '@pages/live/model/types';

const EMPTY_LINEUP: TeamLineup = {
  formation: '4-3-3',
  onPitch: [],
  starters: [],
  substitutes: [],
};

const LIVE_MATCH_FIXTURE: LiveMatch = {
  status: 'live',
  competition: '프리미어리그 · 10라운드',
  venue: '올드 트래퍼드',
  period: '후반',
  clock: "72'",
  home: { name: '맨유', code: 'MUN', score: 3, isUnited: true },
  away: { name: '첼시', code: 'CHE', score: 0, isUnited: false },
  lineups: { united: EMPTY_LINEUP, opponent: EMPTY_LINEUP },
  commentary: [],
};

const CLOSED_MATCH_FIXTURE: LiveMatch = {
  ...LIVE_MATCH_FIXTURE,
  status: 'closed',
};

export { LIVE_MATCH_FIXTURE, CLOSED_MATCH_FIXTURE };
