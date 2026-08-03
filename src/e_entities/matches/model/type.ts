import z from 'zod';
import { lineupSchema, scheduleSchema } from './schemas';

// 경기 일정
export type VenueDTO = z.infer<typeof scheduleSchema.VenueDTOSchema>;
export type ScheduleTeamDTO = z.infer<typeof scheduleSchema.TeamDTOSchema>;
export type ScoreDTO = z.infer<typeof scheduleSchema.ScoreDTOSchema>;
export type MatchScheduleDTO = z.infer<
  typeof scheduleSchema.MatchScheduleDTOSchema
>;
export type MatchScheduleListDTO = z.infer<
  typeof scheduleSchema.TotalMatchScheduleDTOSchema
>;
export type MatchDetailsQueryDTO = z.infer<
  typeof scheduleSchema.MatchDetailsQueryDTOSchema
>;
export type MatchScheduleParams = z.infer<
  typeof scheduleSchema.MatchScheduleParamsSchema
>;

// 경기 라인업
export type LineupTeamDTO = z.infer<typeof lineupSchema.TeamDTOSchema>;
export type CoachDTO = z.infer<typeof lineupSchema.CoachDTOSchema>;
export type PlayerDTO = z.infer<typeof lineupSchema.PlayerDTOSchema>;
export type StartPlayerDTO = z.infer<typeof lineupSchema.StartPlayerDTOSchema>;
export type SubstituteDTO = z.infer<typeof lineupSchema.SubstituteDTOSchema>;
export type LineupDTO = z.infer<typeof lineupSchema.LineupDTOSchema>;
export type EventPlayerDTO = z.infer<typeof lineupSchema.EventPlayerDTOSchema>;
export type EventDTO = z.infer<typeof lineupSchema.EventDTOSchema>;
export type PastMatchDetailDTO = z.infer<
  typeof lineupSchema.PastMatchDetailDTOSchema
>;
export type LiveMatchLineupDTO = z.infer<
  typeof lineupSchema.LiveMatchLineupDTOSchema
>;

// ───────── Matchs (일정 & 결과) ─────────
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
