import {
  MatchScheduleDTO,
  MatchScheduleListDTO,
} from '@entities/matches/types';
import { PL_TEAM_CODE, PL_TEAM_KOREAN_NAME } from '@shared/configs';
import { Match, MatchHa, MatchResult } from '../types';

const MANCHESTER_UNITED_TEAM_ID = 33;

const DAY_CONV = ['일', '월', '화', '수', '목', '금', '토'];

const DAY_MS = 86_400_000;

const calculateDaysUntil = (kickoff: Date, now: Date): number => {
  const kickoffMs = kickoff.getTime();
  return Math.max(0, Math.ceil((kickoffMs - now.getTime()) / DAY_MS));
};

const checkHaInMatch = (match: MatchScheduleDTO): MatchHa => {
  if (match.homeTeam.teamId === MANCHESTER_UNITED_TEAM_ID) {
    return 'home';
  }
  if (match.awayTeam.teamId === MANCHESTER_UNITED_TEAM_ID) {
    return 'away';
  }
  return 'neutral';
};

const formatKickoffTime = (matchDate: Date): string => {
  const hours = matchDate.getHours().toString().padStart(2, '0');
  const minutes = matchDate.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const calculateUnitedResult = (
  match: MatchScheduleDTO,
  ha: MatchHa
): MatchResult | undefined => {
  if (!match.score) {
    return;
  }
  const { home: homeScore, away: awayScore } = match.score;
  if (homeScore == null || awayScore == null || ha === 'neutral') {
    return;
  }
  if (homeScore === awayScore) {
    return 'D';
  }
  const unitedWon =
    (ha === 'home' && homeScore > awayScore) ||
    (ha === 'away' && awayScore > homeScore);
  return unitedWon ? 'W' : 'L';
};

const convertMatchesDTO2DAO = ({
  pastMatches,
  upcomingMatches,
}: MatchScheduleListDTO): Match[] => {
  const now = new Date(Date.now());
  const matchesDAO: Match[] = [];
  pastMatches.map((match) => {
    const matchDate = new Date(match.date);
    const ha = checkHaInMatch(match);

    const convertedMatch: Match = {
      id: match.matchId.toString(),
      month: `${matchDate.getFullYear()}년 ${matchDate.getMonth() + 1}월`,
      date: `${matchDate.getMonth() + 1}/${matchDate.getDate()}`,
      dow: DAY_CONV[matchDate.getDay()], // day of week
      ha,
      home: {
        teamLogoUrl: match.homeTeam.logo,
        code: PL_TEAM_CODE[match.homeTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.homeTeam.name] ?? match.homeTeam.name,
        score: match.score?.home ?? undefined,
        utd: match.homeTeam.teamId === MANCHESTER_UNITED_TEAM_ID,
      },
      away: {
        teamLogoUrl: match.awayTeam.logo,
        code: PL_TEAM_CODE[match.awayTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.awayTeam.name] ?? match.awayTeam.name,
        score: match.score?.away ?? undefined,
        utd: match.awayTeam.teamId === MANCHESTER_UNITED_TEAM_ID,
      },
      status: 'past',
      result: calculateUnitedResult(match, ha),
      time: formatKickoffTime(matchDate),
      venue: match.venue.name ?? match.venue.city,
      kickoff: match.date,
    };
    matchesDAO.push(convertedMatch);
    return convertedMatch;
  });

  upcomingMatches.map((match, idx) => {
    const matchDate = new Date(match.date);
    const ha = checkHaInMatch(match);

    const convertedMatch: Match = {
      id: match.matchId.toString(),
      month: `${matchDate.getFullYear()}년 ${matchDate.getMonth() + 1}월`,
      date: `${matchDate.getMonth() + 1}/${matchDate.getDate()}`,
      dow: DAY_CONV[matchDate.getDay()], // day of week
      ha,
      home: {
        teamLogoUrl: match.homeTeam.logo,
        code: PL_TEAM_CODE[match.homeTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.homeTeam.name] ?? match.homeTeam.name,
        utd: match.homeTeam.teamId === MANCHESTER_UNITED_TEAM_ID,
      },
      away: {
        teamLogoUrl: match.awayTeam.logo,
        code: PL_TEAM_CODE[match.awayTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.awayTeam.name] ?? match.awayTeam.name,
        utd: match.awayTeam.teamId === MANCHESTER_UNITED_TEAM_ID,
      },
      status: idx === 0 ? 'next' : 'upcoming',
      time: formatKickoffTime(matchDate),
      venue: match.venue.name ?? match.venue.city,
      kickoff: match.date,
      countdown:
        idx === 0 ? `D-${calculateDaysUntil(matchDate, now)}` : undefined,
    };
    matchesDAO.push(convertedMatch);
    return convertedMatch;
  });

  matchesDAO.sort((a, b) => {
    const aDate = new Date(a.kickoff);
    const bDate = new Date(b.kickoff);
    return aDate.getTime() - bDate.getTime();
  });

  return matchesDAO;
};

export { convertMatchesDTO2DAO };
