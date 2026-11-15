import { NextResponse } from 'next/server';

import { fetchTeamStatistics } from '@entities/team/api/server';
import { toBffResponse } from '@shared/model';

export const dynamic = 'auto';

export async function GET() {
  const result = await fetchTeamStatistics();
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
