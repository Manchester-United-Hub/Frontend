import { NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchMatchScheduleList } from '@entities/matches/api/server';
import { convertMatchesDTO2DAO } from '@entities/matches/utils';

export const dynamic = 'auto';

const NOW = new Date(Date.now());

const SEASON_CHANGE_MONTH = 7;

export const getSeason = (now: Date) => {
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (month < SEASON_CHANGE_MONTH) return `${year - 1}`;
  return `${year}`;
};

export async function GET() {
  const season = getSeason(NOW);
  const { isSuccess, data, status } = await fetchMatchScheduleList({ season });
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
