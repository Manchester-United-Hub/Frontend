import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

import { toBffResponse } from '@shared/model';
import { HighlightListQueryDTOSchema } from '@entities/highlight/model';
import { fetchHighlightList } from '@entities/highlight/api/server';

export const dynamic = 'auto';

const SEASON_QUERY_KEY = 'season';
const SORT_QUERY_KEY = 'sort';
const PAGE_QUERY_KEY = 'page';
const SIZE_QUERY_KEY = 'size';

const INVALID_QUERY_STATUS = 422;
const INVALID_QUERY_CODE = 'INVALID_QUERY';

// Number()의 관대한 파싱('0x7EA'→2026, ' '→0)이 업스트림까지 새지 않도록 정수 표기만 숫자로 바꾼다.
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

  const parsedQuery = HighlightListQueryDTOSchema.safeParse({
    season: readQueryValue(searchParams, SEASON_QUERY_KEY),
    sort: searchParams.get(SORT_QUERY_KEY) ?? undefined,
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

  const result = await fetchHighlightList(parsedQuery.data);
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
