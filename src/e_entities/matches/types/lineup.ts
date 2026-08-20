import z from 'zod';

import { lineupSchema } from './schemas';

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
