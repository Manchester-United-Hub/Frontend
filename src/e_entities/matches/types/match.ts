export type Competition = '프리미어리그' | 'FA컵' | '챔피언스리그';
export type MatchHa = 'home' | 'away' | 'neutral';
export type MatchStatus = 'past' | 'next' | 'upcoming';
export type MatchResult = 'W' | 'D' | 'L';
export interface MatchSide {
  code: string;
  teamLogoUrl: string;
  nm: string;
  score?: number;
  utd?: boolean;
}

export interface Match {
  id: string;
  month: string;
  date: string;
  dow: string;
  ha: MatchHa;
  home: MatchSide;
  away: MatchSide;
  status: MatchStatus;
  result?: MatchResult;
  time?: string;
  countdown?: string;
  venue: string;
  kickoff: string;
}
export type HaFilter = 'all' | 'home' | 'away';

export interface MatchMonthGroup {
  month: string;
  matches: Match[];
}
