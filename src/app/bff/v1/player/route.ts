import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

import { toBffResponse } from '@shared/model';
import { PlayerListQueryDTOSchema } from '@entities/player/model';
import { fetchPlayerList } from '@entities/player/api/server';

export const dynamic = 'auto';

const SEASON_QUERY_KEY = 'season';
const PAGE_QUERY_KEY = 'page';
const SIZE_QUERY_KEY = 'size';

const INVALID_QUERY_STATUS = 422;
const INVALID_QUERY_CODE = 'INVALID_QUERY';

// 정수 표기만 숫자로 승격한다. Number()의 관대한 파싱('0x7EA'→2026, ' '→0, '2.0e3'→2000)이
// 업스트림까지 새어 들어가는 것을 막는다. 승격에 실패한 값은 문자열 그대로 두어 스키마가 거른다.
const NON_NEGATIVE_INTEGER_PATTERN = /^\d+$/;

const readQueryValue = (
  searchParams: URLSearchParams,
  key: string
): unknown => {
  const raw = searchParams.get(key);
  if (raw === null) return undefined;

  return NON_NEGATIVE_INTEGER_PATTERN.test(raw) ? Number(raw) : raw;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // season·page·size는 모두 선택 파라미터다. 값이 있는데 계약(0-base page, size 1~100)을
  // 벗어나면 업스트림에 넘기지 않고 여기서 거절한다.
  const parsedQuery = PlayerListQueryDTOSchema.safeParse({
    season: readQueryValue(searchParams, SEASON_QUERY_KEY),
    page: readQueryValue(searchParams, PAGE_QUERY_KEY),
    size: readQueryValue(searchParams, SIZE_QUERY_KEY),
  });

  if (!parsedQuery.success) {
    return NextResponse.json(
      toBffResponse({
        isSuccess: false,
        status: INVALID_QUERY_STATUS,
        data: {
          code: INVALID_QUERY_CODE,
          message: z.prettifyError(parsedQuery.error),
        },
      }),
      { status: INVALID_QUERY_STATUS }
    );
  }

  const result = await fetchPlayerList(parsedQuery.data);
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
