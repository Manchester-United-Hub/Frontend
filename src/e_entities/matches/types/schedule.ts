import z from 'zod';

import { scheduleSchema } from './schemas';

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
