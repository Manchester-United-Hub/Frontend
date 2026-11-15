type MatchSide = 'united' | 'opponent';
type LiveStatus = 'live' | 'closed';

interface LiveTeam {
  name: string;
  code: string;
  score: number;
  isUnited: boolean;
}

type PlayerMarkType = 'goal' | 'yellowCard' | 'redCard' | 'subIn' | 'subOut';

interface PlayerMark {
  type: PlayerMarkType;
  minute: string;
}

interface LineupPlayer {
  id: number;
  number: number;
  name: string;
  nameEn: string;
  position: string;
  grid: string | null;
  marks: PlayerMark[];
}

interface TeamLineup {
  formation: string;
  onPitch: LineupPlayer[];
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

type CommentaryKind =
  | 'goal'
  | 'penalty'
  | 'yellowCard'
  | 'redCard'
  | 'sub'
  | 'chance'
  | 'period';

interface CommentaryEntry {
  id: string;
  minute: string;
  side: MatchSide | 'neutral';
  kind: CommentaryKind;
  text: string;
}

interface LiveMatch {
  status: LiveStatus;
  competition: string;
  venue: string;
  period: string;
  clock: string;
  home: LiveTeam;
  away: LiveTeam;
  lineups: Record<MatchSide, TeamLineup>;
  commentary: CommentaryEntry[];
}

export type {
  MatchSide,
  LiveStatus,
  LiveTeam,
  PlayerMarkType,
  PlayerMark,
  LineupPlayer,
  TeamLineup,
  CommentaryKind,
  CommentaryEntry,
  LiveMatch,
};
