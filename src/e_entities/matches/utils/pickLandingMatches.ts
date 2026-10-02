import { Match } from '../types';
import type { LandingMatches } from '@entities/matches/types/landingMatches';

const pickLatestPastMatch = (matches: Match[]): Match | null => {
  const pastMatches = matches.filter((match) => match.status === 'past');
  if (pastMatches.length === 0) {
    return null;
  }
  const sorted = pastMatches.toSorted(
    (a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
  );
  return sorted[0] ?? null;
};

/**
 * kickoff 오름차순 비교. kickoff이 동률이면 status가 'next'인 쪽을 우선한다
 * (High-2 재작업, D-11 — status:'next' 플래그는 배열 인덱스 0에 붙는 것이라 kickoff보다
 * 우선할 근거가 없고, tie-break로만 쓴다).
 */
const compareByKickoffThenNextFlag = (a: Match, b: Match): number => {
  const kickoffDiff = new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime();
  if (kickoffDiff !== 0) {
    return kickoffDiff;
  }
  if (a.status === 'next') return -1;
  if (b.status === 'next') return 1;
  return 0;
};

/**
 * status가 'next' | 'upcoming'인 항목 전체에서 kickoff 최솟값을 고른다. 상류가 배열을
 * kickoff 순으로 정렬해 보낸다는 보장이 없으므로 정렬 순서(인덱스 0의 'next' 플래그)에
 * 의존하지 않는다.
 */
const pickEarliestNextMatch = (matches: Match[]): Match | null => {
  const candidates = matches.filter(
    (match) => match.status === 'next' || match.status === 'upcoming'
  );
  if (candidates.length === 0) {
    return null;
  }
  const sorted = candidates.toSorted(compareByKickoffThenNextFlag);
  return sorted[0] ?? null;
};

const pickLandingMatches = (matches: Match[]): LandingMatches => ({
  recent: pickLatestPastMatch(matches),
  next: pickEarliestNextMatch(matches),
});

export { pickLandingMatches };
