import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchPastMatchDetail } from '@entities/matches/api/server';

export const dynamic = 'auto';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;

  const result = await fetchPastMatchDetail({ matchId: Number(matchId) });
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
