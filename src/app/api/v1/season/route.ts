import { NextResponse } from 'next/server';

import { getCurrentSeason } from '@entities/seasonInfo/api/server';
import { toBffResponse } from '@shared/model';

export async function GET() {
  try {
    const { isSuccess, data, status } = await getCurrentSeason();
    if (isSuccess) {
      return NextResponse.json(toBffResponse({ isSuccess, data, status }), {
        status,
      });
    }
    console.warn('SeasonInfoError: check your data,', data);
    return NextResponse.json(toBffResponse({ isSuccess, data, status }), {
      status,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      toBffResponse({
        isSuccess: false,
        data: {
          code: '500',
          message: 'SERVER_ERROR: check your server log.',
        },
        status: 500,
      }),
      { status: 500 }
    );
  }
}
