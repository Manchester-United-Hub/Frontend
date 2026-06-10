import { NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchGameScheduleList } from '@entities/game/api/server';

export const dynamic = 'auto';

export async function GET() {
  const result = await fetchGameScheduleList();
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
