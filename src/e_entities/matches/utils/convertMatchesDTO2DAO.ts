import { MatchScheduleDTO } from '@entities/matches/model';
import { Match, MatchHa } from '../model';

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
  'Arsenal FC': 'ARS',
  'Aston Villa FC': 'AVL',
  'AFC Bournemouth': 'BOU',
  'Brentford FC': 'BRE',
  'Brighton & Hove Albion FC': 'BHA',
  'Chelsea FC': 'CHE',
  'Crystal Palace FC': 'CRY',
  'Everton FC': 'EVE',
  'Fulham FC': 'FUL',
  'Ipswich Town FC': 'IPS',
  'Leicester City FC': 'LEI',
  'Liverpool FC': 'LIV',
  'Manchester City FC': 'MCI',
  'Manchester United FC': 'MUN',
  'Newcastle United FC': 'NEW',
  'Nottingham Forest FC': 'NFO',
  'Southampton FC': 'SOU',
  'Tottenham Hotspur FC': 'TOT',
  'West Ham United FC': 'WHU',
  'Wolverhampton Wanderers FC': 'WOL',
};

const convertMatchesDTO2DAO = (matchesDTO: MatchScheduleDTO[]): Match[] => {
  const checkHaInMatch = (match: MatchScheduleDTO): MatchHa => {
    if (match.homeTeam.teamId === 33) {
      return 'home';
    }
    if (match.awayTeam.teamId === 33) {
      return 'away';
    }
    return 'neutral';
  };
  const matchesDAO: Match[] = matchesDTO.map((match) => {
    const matchDate = new Date(match.date);

    const convertedMatch: Match = {
      id: match.matchId.toString(),
      month: `${matchDate.getFullYear()}년 ${matchDate.getMonth() + 1}월`,
      date: `${matchDate.getMonth() + 1}/${matchDate.getDate()}`,
      dow: DAY_CONV[matchDate.getDay()],
      comp: '프리미어리그', // @TODO : 추후 리그 내용 포함하기
      round: '0R',
      ha: checkHaInMatch(match),
      home: {
        teamLogoUrl: match.homeTeam.logo,
        code: PL_TEAM_CODE[match.homeTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.homeTeam.name] ?? match.homeTeam.name,
        score: match.score.home ?? undefined,
      },
      away: {
        teamLogoUrl: match.awayTeam.logo,
        code: PL_TEAM_CODE[match.awayTeam.name],
        nm: PL_TEAM_KOREAN_NAME[match.awayTeam.name] ?? match.awayTeam.name,
        score: match.score.away ?? undefined,
      },
      status: 'past',
      result: 'D',
      venue: match.venue.name,
    };
    return convertedMatch;
  });
  return matchesDAO;
};

export { convertMatchesDTO2DAO };
