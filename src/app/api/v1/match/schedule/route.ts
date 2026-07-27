import { NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchMatchScheduleList } from '@entities/matches/api/server';
import { convertMatchesDTO2DAO } from '@entities/matches/utils';

export const dynamic = 'auto';

export async function GET() {
  const { isSuccess, data, status } = await fetchMatchScheduleList();
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
