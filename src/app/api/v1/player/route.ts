import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { PlayerListQueryDTO } from '@entities/player/model';
import { fetchPlayerList } from '@entities/player/api/server';

export const dynamic = 'auto';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const query: PlayerListQueryDTO = {
    season: Number(searchParams.get('season')!),
    position: searchParams.get('position') ?? undefined,
  };

  const result = await fetchPlayerList(query);
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
