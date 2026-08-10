import z from 'zod';
import { DateStringType } from '@shared/model';

const PlayerListQueryDTOSchema = z.object({
  season: z.number(),
});

const PlayerDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  birthDate: DateStringType['yyyy-MM-dd'],
  nationality: z.string(),
  height: z.string(),
  weight: z.string(),
  number: z.number().nullable(),
  position: z.string(),
  photo: z.string(),
});

const PlayerListDTOSchema = z.array(PlayerDTOSchema);

// LeagueStatisticsDTOSchema: /api/player-details/{playerId} 실 응답 확인 결과(code-review H-1 —
// 스쿼드 44명 전수·통계 34행 조사, 근거 레코드 GK 162511) 다수 필드가 null로 온다(포지션·출전
// 상황에 따라 기록되지 않는 지표). leagueId·leagueName·appearances 등 항상 채워지는 핵심
// 식별/집계 필드만 non-null로 두고 나머지는 관측된 대로 nullable 처리한다. (최초 작성 시 D-13
// 3건 표본(1485·50132·532)만 대조해 10개 필드가 non-null로 잘못 선언됐던 것을 44명 전수
// 재조사로 바로잡았다 — minutes/rating/dribblesAttempts/dribblesSuccess/passesTotal/
// passesKey/passesAccuracy/duelsTotal/duelsWon/foulsDrawn.)
const LeagueStatisticsDTOSchema = z.object({
  leagueId: z.number(),
  leagueName: z.string(),
  appearances: z.number(),
  lineups: z.number(),
  minutes: z.number().nullable(),
  rating: z.string().nullable(),
  captain: z.boolean(),
  substitutesIn: z.number(),
  substitutesOut: z.number(),
  substitutesBench: z.number(),
  shotsTotal: z.number().nullable(),
  shotsOn: z.number().nullable(),
  goals: z.number(),
  assists: z.number(),
  dribblesAttempts: z.number().nullable(),
  dribblesSuccess: z.number().nullable(),
  dribblesPast: z.number().nullable(),
  penaltiesWon: z.number().nullable(),
  penaltiesScored: z.number(),
  penaltiesMissed: z.number(),
  passesTotal: z.number().nullable(),
  passesKey: z.number().nullable(),
  passesAccuracy: z.string().nullable(),
  tacklesTotal: z.number().nullable(),
  tacklesBlocks: z.number().nullable(),
  tacklesInterceptions: z.number().nullable(),
  duelsTotal: z.number().nullable(),
  duelsWon: z.number().nullable(),
  foulsDrawn: z.number().nullable(),
  foulsCommitted: z.number().nullable(),
  goalsConceded: z.number(),
  saves: z.number().nullable(),
  penaltiesSaved: z.number().nullable(),
  yellowCards: z.number(),
  yellowRedCards: z.number(),
  redCards: z.number(),
});

const PlayerStatisticsListDTOSchema = z.array(LeagueStatisticsDTOSchema);

export {
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
  LeagueStatisticsDTOSchema,
  PlayerStatisticsListDTOSchema,
};
