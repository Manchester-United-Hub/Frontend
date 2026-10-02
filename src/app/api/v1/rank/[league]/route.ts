import { NextRequest, NextResponse } from 'next/server';

import { getPremierLeagueRank } from '@entities/rank/api/server';
import { convertPLRankDTO2DAO } from '@entities/rank/utils';
import { toBffResponse } from '@shared/model';

export const dynamic = 'auto';
export const revalidate = 60;

// D-4: 요청 season 쿼리를 읽는 단일 지점. 백엔드 쿼리 파라미터명이 바뀌면
// SEASON_QUERY_KEY만 수정하면 된다(fetchPremierLeagueRank.ts의 조립 지점과 짝).
const SEASON_QUERY_KEY = 'season';
const INVALID_SEASON_STATUS = 422;
const INVALID_SEASON_CODE = 'INVALID_SEASON';
// 4자리 연도 표기만 허용한다. Number()의 관대한 파싱(' '→0, '0x7EA'→2026,
// '2.0e3'→2000, 음수)이 업스트림까지 새어 들어가는 것을 막는다(M-4).
const SEASON_YEAR_PATTERN = /^\d{4}$/;
// 프리미어리그 원년(1992-93). 이전 시즌은 이 라우트의 도메인이 아니다.
const MIN_SEASON_START_YEAR = 1992;

const parseSeasonQuery = (req: NextRequest): number | null => {
  const raw = req.nextUrl.searchParams.get(SEASON_QUERY_KEY);
  if (!raw || !SEASON_YEAR_PATTERN.test(raw)) return null;
  const season = Number(raw);
  return season >= MIN_SEASON_START_YEAR ? season : null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ league: string }> }
) {
  try {
    const { league } = await params;
    switch (league) {
      case 'pl': {
        const season = parseSeasonQuery(req);
        if (season === null) {
          return NextResponse.json(
            toBffResponse({
              isSuccess: false,
              data: {
                code: INVALID_SEASON_CODE,
                message: `INVALID_SEASON: ${SEASON_QUERY_KEY} query must be a 4-digit year >= ${MIN_SEASON_START_YEAR}.`,
              },
              status: INVALID_SEASON_STATUS,
            }),
            {
              status: INVALID_SEASON_STATUS,
            }
          );
        }

        const { isSuccess, status, data } = await getPremierLeagueRank({
          season,
        });
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
      }

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
