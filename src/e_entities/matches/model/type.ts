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
  typeof scheduleSchema.MatchScheduleListDTOSchema
>;
export type MatchDetailsQueryDTO = z.infer<
  typeof scheduleSchema.MatchDetailsQueryDTOSchema
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
