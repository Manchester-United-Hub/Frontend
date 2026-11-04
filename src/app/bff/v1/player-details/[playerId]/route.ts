import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { PlayerListQueryDTO } from '@entities/player/model';
import { fetchPlayerStatistics } from '@entities/player/api/server';

export const dynamic = 'auto';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;
  const { searchParams } = request.nextUrl;

  const query: PlayerListQueryDTO = {
    season: Number(searchParams.get('season')!),
  };

  const result = await fetchPlayerStatistics(Number(playerId), query);
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
