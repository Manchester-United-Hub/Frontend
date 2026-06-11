import { NextRequest, NextResponse } from 'next/server';

import { toBffResponse } from '@shared/model';
import { NewsQuerySchema } from '@entities/news/model';
import { fetchNewsList, fetchRecentNews } from '@entities/news/api/server';

export const dynamic = 'auto';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const preview = searchParams.get('preview');

  if (preview === '1') {
    const result = await fetchRecentNews();
    return NextResponse.json(toBffResponse(result), { status: result.status });
  }

  const parsed = NewsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const result = await fetchNewsList(parsed.data);
  return NextResponse.json(toBffResponse(result), { status: result.status });
}
