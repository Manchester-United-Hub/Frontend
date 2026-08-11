import { getCurrentSeason } from '@entities/season/api/server';
import { formatSeasonLabel } from '@entities/season/utils';
import { SeasonPage } from '@pages/season';

export const revalidate = 3600;

// 시즌 조회 실패 시 폴백 시즌 시작연도
const FALLBACK_SEASON_START_YEAR = 2026;

const fetchSeasonStartYear = async (): Promise<number> => {
  try {
    const result = await getCurrentSeason();
    return result.isSuccess ? result.data.season : FALLBACK_SEASON_START_YEAR;
  } catch (e) {
    console.error(e);
    return FALLBACK_SEASON_START_YEAR;
  }
};

export default async function Season() {
  const seasonStartYear = await fetchSeasonStartYear();
  const season = formatSeasonLabel(seasonStartYear);

  return (
    <>
      <SeasonPage season={season} />
    </>
  );
}
