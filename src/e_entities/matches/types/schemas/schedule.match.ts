import z from 'zod';
import { DateStringType } from '@shared/model';

const MatchScheduleParamsSchema = z.object({
  season: z.string(),
});

// 경기
const VenueDTOSchema = z.object({
  name: z.string().nullable(),
  city: z.string(),
});

const TeamDTOSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  logo: z.httpUrl(),
  winner: z.boolean().nullable(),
});

const ScoreDTOSchema = z
  .object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  })
  .nullable();

const MatchScheduleDTOSchema = z.object({
  matchId: z.number(),
  date: DateStringType['yyyy-MM-ddTHH:mm:ss'],
  venue: VenueDTOSchema,
  homeTeam: TeamDTOSchema,
  awayTeam: TeamDTOSchema,
  score: ScoreDTOSchema,
});

const MatchScheduleListDTOSchema = z.array(MatchScheduleDTOSchema);

const TotalMatchScheduleDTOSchema = z.object({
  pastMatches: MatchScheduleListDTOSchema,
  upcomingMatches: MatchScheduleListDTOSchema,
});

const MatchDetailsQueryDTOSchema = z.object({
  matchId: z.number(),
});

export {
  MatchDetailsQueryDTOSchema,
  MatchScheduleDTOSchema,
  MatchScheduleParamsSchema,
  TotalMatchScheduleDTOSchema,
  MatchScheduleListDTOSchema,
  ScoreDTOSchema,
  TeamDTOSchema,
  VenueDTOSchema,
};
