import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchMatchScheduleList } from '@entities/matches/api/server';
import { convertMatchesDTO2DAO } from '@entities/matches/utils';

const SEASON_QUERY_KEY = 'season';
const INVALID_SEASON_STATUS = 422;
const INVALID_SEASON_CODE = 'INVALID_SEASON';
const SEASON_YEAR_PATTERN = /^\d{4}$/;
const MIN_SEASON_START_YEAR = 1992;

const parseSeasonQuery = (req: NextRequest): number | null => {
  const raw = req.nextUrl.searchParams.get(SEASON_QUERY_KEY);
  if (!raw || !SEASON_YEAR_PATTERN.test(raw)) return null;
  const season = Number(raw);
  return season >= MIN_SEASON_START_YEAR ? season : null;
};

export async function GET(req: NextRequest) {
  const season = parseSeasonQuery(req);
  if (season === null) {
    return NextResponse.json(
      toBffResponse({
        isSuccess: false,
        data: {
          code: INVALID_SEASON_CODE,
          message: `INVALID_SEASON: ${SEASON_QUERY_KEY} query must be a 4-digit year >= ${MIN_SEASON_START_YEAR}.`,
        },
        status: INVALID_SEASON_STATUS,
      }),
      {
        status: INVALID_SEASON_STATUS,
      }
    );
  }
  const { isSuccess, data, status } = await fetchMatchScheduleList({
    season: `${season}`,
  });
  if (isSuccess) {
    const matchDao = convertMatchesDTO2DAO(data);

    return NextResponse.json(
      toBffResponse({ isSuccess, data: matchDao, status }),
      { status: status }
    );
  }

  return NextResponse.json(toBffResponse({ isSuccess, data, status }), {
    status: status,
  });
}
