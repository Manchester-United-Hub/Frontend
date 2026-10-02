const NEXT_YEAR_SUFFIX_MODULO = 100;
const SEASON_LABEL_SUFFIX_LENGTH = 2;

const formatSeasonLabel = (season: number): string => {
  const nextYearSuffix = (season + 1) % NEXT_YEAR_SUFFIX_MODULO;
  const paddedSuffix = `${nextYearSuffix}`.padStart(
    SEASON_LABEL_SUFFIX_LENGTH,
    '0'
  );
  return `${season}-${paddedSuffix}`;
};

export { formatSeasonLabel };
