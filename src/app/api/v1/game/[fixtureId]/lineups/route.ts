import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { fetchLiveGameLineup } from '@entities/game/api/server';

export const dynamic = 'auto';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;

  const result = await fetchLiveGameLineup({ fixtureId: BigInt(fixtureId) });
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
