import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { NewsQuery } from '@entities/news/model';
import { fetchNewsList, fetchRecentNews } from '@entities/news/api/server';

export const dynamic = 'auto';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const preview = searchParams.get('preview');

  if (preview === '1') {
    const result = await fetchRecentNews();
    return NextResponse.json(toBffResponse(result), { status: result.status });
  }

  const newsParams: NewsQuery = {
    cursorAt: searchParams.get('cursorAt')!,
    cursorId: BigInt(searchParams.get('cursorId')!),
    size: Number(searchParams.get('size')!),
  };

  const result = await fetchNewsList(newsParams);
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
