import {
  MatchScheduleDTO,
  MatchScheduleListDTO,
} from '@entities/matches/model';
import { Match, MatchHa, MatchResult } from '../model';

const MANCHESTER_UNITED_TEAM_ID = 33;

const DAY_CONV = ['일', '월', '화', '수', '목', '금', '토'];

const PL_TEAM_KOREAN_NAME: Record<string, string> = {
  Arsenal: '아스널',
  'Aston Villa': '애스턴 빌라',
  Bournemouth: '본머스',
  Brentford: '브렌트퍼드',
  'Brighton & Hove Albion': '브라이튼 앤 호브 알비온',
  Chelsea: '첼시',
  'Crystal Palace': '크리스털 팰리스',
  Everton: '에버턴',
  Fulham: '풀럼',
  'Ipswich Town': '입스위치 타운',
  'Leicester City': '레스터 시티',
  Liverpool: '리버풀',
  'Manchester City': '맨체스터 시티',
  'Manchester United': '맨체스터 유나이티드',
  'Newcastle United': '뉴캐슬 유나이티드',
  'Nottingham Forest': '노팅엄 포레스트',
  Southampton: '사우샘프턴',
  'Tottenham Hotspur': '토트넘 홋스퍼',
  'West Ham United': '웨스트햄 유나이티드',
  'Wolverhampton Wanderers': '울버햄튼 원더러스',
};

const PL_TEAM_CODE: Record<string, string> = {
  Arsenal: 'ARS',
  'Aston Villa': 'AVL',
  'AFC Bournemouth': 'BOU',
  Brentford: 'BRE',
  'Brighton & Hove Albion': 'BHA',
  Chelsea: 'CHE',
  'Crystal Palace': 'CRY',
  Everton: 'EVE',
  Fulham: 'FUL',
  'Ipswich Town': 'IPS',
  'Leicester City': 'LEI',
  Liverpool: 'LIV',
  'Manchester City': 'MCI',
  'Manchester United': 'MUN',
  'Newcastle United': 'NEW',
  'Nottingham Forest': 'NFO',
  Southampton: 'SOU',
  'Tottenham Hotspur': 'TOT',
  'West Ham United': 'WHU',
  'Wolverhampton Wanderers': 'WOL',
};

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
  const { home: homeScore, away: awayScore } = match.score;
  if (homeScore == null || awayScore == null || ha === 'neutral') {
    return undefined;
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
        score: match.score.home ?? undefined,
        utd: match.homeTeam.teamId === MANCHESTER_UNITED_TEAM_ID,
      },
      away: {
        teamLogoUrl: match.awayTeam.logo,
        code: PL_TEAM_CODE[match.awayTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.awayTeam.name] ?? match.awayTeam.name,
        score: match.score.away ?? undefined,
        utd: match.awayTeam.teamId === MANCHESTER_UNITED_TEAM_ID,
      },
      status: 'past',
      result: calculateUnitedResult(match, ha),
      time: formatKickoffTime(matchDate),
      venue: match.venue.name,
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
      venue: match.venue.name,
      kickoff: match.date,
      countdown:
        idx === 0 ? `D-${calculateDaysUntil(matchDate, now)}` : undefined,
    };
    matchesDAO.push(convertedMatch);
    return convertedMatch;
  });

  return matchesDAO;
};

export { convertMatchesDTO2DAO };
