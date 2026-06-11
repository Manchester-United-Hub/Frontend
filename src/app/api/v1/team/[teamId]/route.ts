import { NextRequest, NextResponse } from 'next/server';

import { fetchTeamInfo } from '@entities/team/api/server';
import { toBffResponse } from '@shared/model';

export const dynamic = 'auto';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  const { teamId } = await params;

  const result = await fetchTeamInfo({ teamId: Number(teamId) });
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
