import { NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { getLandingMatches } from '@entities/matches/api/server/getLandingMatches';

const SCHEDULE_UNAVAILABLE_STATUS = 502;
const SCHEDULE_UNAVAILABLE_CODE = 'SCHEDULE_UNAVAILABLE';
const SCHEDULE_UNAVAILABLE_MESSAGE =
  'SCHEDULE_UNAVAILABLE: upstream schedule fetch failed.';
const LANDING_MATCHES_SUCCESS_STATUS = 200;

export async function GET() {
  const landingMatches = await getLandingMatches();

  if (landingMatches === null) {
    return NextResponse.json(
      toBffResponse({
        isSuccess: false,
        data: {
          code: SCHEDULE_UNAVAILABLE_CODE,
          message: SCHEDULE_UNAVAILABLE_MESSAGE,
        },
        status: SCHEDULE_UNAVAILABLE_STATUS,
      }),
      { status: SCHEDULE_UNAVAILABLE_STATUS }
    );
  }

  return NextResponse.json(
    toBffResponse({
      isSuccess: true,
      data: landingMatches,
      status: LANDING_MATCHES_SUCCESS_STATUS,
    }),
    { status: LANDING_MATCHES_SUCCESS_STATUS }
  );
}
