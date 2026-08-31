/**
 * filterPlayers — 선수 목록 필터링 순수 함수 (ADR-6).
 *
 * players-list.jsx(97-111행)의 규칙을 그대로 이행한다:
 * - 포지션·스쿼드: 'all'이 아니면 정확히 일치해야 함
 * - 활약연도(decade): startYear = parseInt(years.slice(0,4)) → floor(y/DECADE_DIVISOR)*DECADE_DIVISOR
 * - 검색: 한글 name은 포함(includes), 영문 nameEn은 소문자 변환 후 포함
 * - 필터 간 AND 결합
 *
 * 입력→출력만 있는 순수 함수 — 부수효과 없음. 단위 테스트 대상.
 */

import { ALL_FILTER_KEY } from './playerFilter';
import type { PlayerFilterCriteria } from './playerFilter';
import type { PlayerListItem } from './playerListItem';

const DECADE_DIVISOR = 10;

const getStartYear = (player: PlayerListItem): number => parseInt(player.years.slice(0, 4), 10);

const getDecadeKey = (startYear: number): string =>
  String(Math.floor(startYear / DECADE_DIVISOR) * DECADE_DIVISOR);

const matchesPosition = (player: PlayerListItem, position: string): boolean =>
  position === ALL_FILTER_KEY || player.position === position;

const matchesSquad = (player: PlayerListItem, squad: string): boolean =>
  squad === ALL_FILTER_KEY || player.squad === squad;

const matchesDecade = (player: PlayerListItem, decade: string): boolean =>
  decade === ALL_FILTER_KEY || getDecadeKey(getStartYear(player)) === decade;

const matchesQuery = (player: PlayerListItem, query: string): boolean => {
  const trimmed = query.trim();
  if (!trimmed) return true;

  const lowered = trimmed.toLowerCase();
  return player.name.includes(trimmed) || player.nameEn.toLowerCase().includes(lowered);
};

const filterPlayers = (
  players: PlayerListItem[],
  criteria: PlayerFilterCriteria,
): PlayerListItem[] =>
  players.filter(
    (player) =>
      matchesPosition(player, criteria.position) &&
      matchesSquad(player, criteria.squad) &&
      matchesDecade(player, criteria.decade) &&
      matchesQuery(player, criteria.query),
  );

export { filterPlayers };
