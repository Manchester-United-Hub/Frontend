import { NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchMatchScheduleList } from '@entities/matches/api/server';

export const dynamic = 'auto';

export async function GET() {
  const result = await fetchMatchScheduleList();
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
