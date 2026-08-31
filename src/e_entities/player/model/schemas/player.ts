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

export {
  MAX_PAGE_SIZE,
  PlayerListQueryDTOSchema,
  PlayerDTOSchema,
  PlayerListDTOSchema,
};
