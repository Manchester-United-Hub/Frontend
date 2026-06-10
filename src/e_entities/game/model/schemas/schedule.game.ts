import z from 'zod';
import { DateStringType } from '@shared/model';

// 경기
const VenueDTOSchema = z.object({
  name: z.string(),
  city: z.string(),
});

const TeamDTOSchema = z.object({
  teamId: z.bigint(),
  name: z.string(),
  logo: z.httpUrl(),
  winner: z.boolean(),
});

const ScoreDTOSchema = z.object({
  home: z.number().nullable(),
  away: z.number().nullable(),
});

const GameScheduleDTOSchema = z.object({
  fixtureId: z.bigint(),
  date: DateStringType['yyyy-MM-ddTHH:mm'],
  venue: VenueDTOSchema,
  homeTeam: TeamDTOSchema,
  AwayTeam: TeamDTOSchema,
  score: ScoreDTOSchema,
});

const GameScheduleListDTOSchema = z.array(GameScheduleDTOSchema);

const GameDetailsQueryDTOSchema = z.object({
  fixtureId: z.bigint(),
});

export {
  GameDetailsQueryDTOSchema,
  GameScheduleDTOSchema,
  GameScheduleListDTOSchema,
  ScoreDTOSchema,
  TeamDTOSchema,
  VenueDTOSchema,
};
