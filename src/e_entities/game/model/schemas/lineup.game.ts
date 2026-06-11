import z from 'zod';

const TeamDTOSchema = z.object({
  teamId: z.number(),
  name: z.string(),
  logo: z.httpUrl(),
});

const CoachDTOSchema = z.object({
  coachId: z.number(),
  name: z.string(),
  photo: z.httpUrl(),
});

const PlayerDTOSchema = z.object({
  playerId: z.number(),
  name: z.string(),
  number: z.number(),
  position: z.string(),
});

const StartPlayerDTOSchema = PlayerDTOSchema.extend({
  grid: z.string(),
});
const SubstituteDTOSchema = PlayerDTOSchema.extend({
  grid: z.string().nullable(),
});

const LineupDTOSchema = z.object({
  team: TeamDTOSchema,
  formatioin: z.string(),
  coach: CoachDTOSchema,
  startPlayers: z.array(StartPlayerDTOSchema),
  substitutes: z.array(SubstituteDTOSchema),
});

const EventPlayerDTOSchema = PlayerDTOSchema.extend({
  number: z.number().nullable(),
  position: z.string().nullable(),
  grid: z.string().nullable(),
});

const EventDTOSchema = z.object({
  elapsed: z.number(),
  extra: z.number(),
  team: TeamDTOSchema,
  type: z.string(),
  detail: z.string(),
  player: EventPlayerDTOSchema,
  assist: EventPlayerDTOSchema,
  comments: z.string(),
});

const PastGameDetailDTOSchema = z.object({
  lineups: z.array(LineupDTOSchema),
  events: z.array(EventDTOSchema),
});

const LiveGameLineupDTOSchema = z.object({
  fixtureId: z.number(),
  lineups: z.array(LineupDTOSchema),
});

export {
  TeamDTOSchema,
  CoachDTOSchema,
  PlayerDTOSchema,
  StartPlayerDTOSchema,
  SubstituteDTOSchema,
  LineupDTOSchema,
  EventPlayerDTOSchema,
  EventDTOSchema,
  PastGameDetailDTOSchema,
  LiveGameLineupDTOSchema,
};
