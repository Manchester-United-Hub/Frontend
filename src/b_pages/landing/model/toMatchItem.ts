/**
 * Match(도메인) → MatchItem(랜딩 뷰 타입) 매퍼.
 *
 * MatchSide.code는 타입상 string이지만, convertMatchesDTO2DAO의
 * PL_TEAM_CODE[team.name] 조회에 fallback이 없고 noUncheckedIndexedAccess가
 * 꺼져 있어 비PL 상대(예: 챔피언스리그 대진)면 런타임에 undefined일 수 있다.
 * e_entities는 승인 밖이라 이 매핑 경계에서 fallback을 건다.
 */
import type { Match, MatchSide } from '@entities/matches/types';

import {
  FALLBACK_TEAM_CODE,
  LANDING_MATCH_COMPETITION,
  NEXT_MATCH_TAG,
  RECENT_MATCH_TAG,
} from './landingMatchConfigs';
import type { MatchItem, MatchItemTeam } from './types';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const toMatchItemTeam = (side: MatchSide): MatchItemTeam => ({
  code: side.code ?? FALLBACK_TEAM_CODE,
  name: side.nm,
  score: side.score,
  highlight: side.utd,
});

const formatMatchDate = (kickoff: string): string => {
  const kickoffDate = new Date(kickoff);
  const month = kickoffDate.getMonth() + 1;
  const day = kickoffDate.getDate();
  const dow = DAY_LABELS[kickoffDate.getDay()];
  return `${month}월 ${day}일 (${dow})`;
};

const toMatchItem = (match: Match, variant: 'next' | 'past'): MatchItem => ({
  variant,
  tag: variant === 'next' ? NEXT_MATCH_TAG : RECENT_MATCH_TAG,
  competition: LANDING_MATCH_COMPETITION,
  home: toMatchItemTeam(match.home),
  away: toMatchItemTeam(match.away),
  result: match.result,
  venue: match.venue,
  date: formatMatchDate(match.kickoff),
  time: match.time,
  countdown: match.countdown,
});

export { toMatchItem };
