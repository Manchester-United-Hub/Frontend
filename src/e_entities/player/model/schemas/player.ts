import z from 'zod';
import { DateStringType } from '@shared/model';

const MIN_PAGE_NUMBER = 0;
const MIN_PAGE_SIZE = 1;
/** `/api/players`가 허용하는 size 상한(swagger: maximum 100). */
const MAX_PAGE_SIZE = 100;

/** season·page·size 모두 선택 파라미터다 — season을 생략하면 전체 선수를 조회한다. */
const PlayerListQueryDTOSchema = z.object({
  season: z.number().int().optional(),
  page: z.number().int().min(MIN_PAGE_NUMBER).optional(),
  size: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).optional(),
});

/**
 * `SeasonPlayerResponse` 계약. birthDate·nationality·height·weight·number·position은
 * 업스트림이 값을 채우지 못한 선수에서 null로 내려온다(실측 확인).
 */
const PlayerDTOSchema = z.object({
  id: z.number(),
  name: z.string(),
  birthDate: DateStringType['yyyy-MM-dd'].nullable(),
  nationality: z.string().nullable(),
  height: z.string().nullable(),
  weight: z.string().nullable(),
  number: z.number().nullable(),
  position: z.string().nullable(),
  photo: z.string(),
  seasons: z.array(z.number()),
});

/** `SeasonPlayerListResponse` 계약 — 배열이 아니라 페이지 봉투다. */
const PlayerListDTOSchema = z.object({
  players: z.array(PlayerDTOSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
});

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
  MAX_PAGE_SIZE,
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
  LeagueStatisticsDTOSchema,
  PlayerStatisticsListDTOSchema,
};
