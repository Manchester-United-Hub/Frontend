import { NextRequest, NextResponse } from 'next/server';

import { getPremierLeagueRank } from '@entities/rank/api/server';
import { convertPLRankDTO2DAO } from '@entities/rank/utils';
import { toBffResponse } from '@shared/model';

export const dynamic = 'auto';
export const revalidate = 60;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  try {
    const { league } = await params;
    switch (league) {
      case 'pl':
        const { isSuccess, status, data } = await getPremierLeagueRank();
        if (isSuccess) {
          const plRankDAO = convertPLRankDTO2DAO(data);

          return NextResponse.json(
            toBffResponse({ isSuccess, data: plRankDAO, status }),
            {
              status,
            }
          );
        }
        return NextResponse.json(toBffResponse({ isSuccess, data, status }), {
          status,
        });

      default:
        return NextResponse.json(
          toBffResponse({
            isSuccess: false,
            data: {
              code: '400',
              message: `URL_ERROR: check your URL Params. league: ${league}`,
            },
            status: 400,
          }),
          {
            status: 400,
          }
        );
    }
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
