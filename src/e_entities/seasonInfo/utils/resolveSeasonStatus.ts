type SeasonStatus = 'upcoming' | 'ongoing';

const resolveSeasonStatus = (started: boolean): SeasonStatus =>
  started ? 'ongoing' : 'upcoming';

export { resolveSeasonStatus };
export type { SeasonStatus };
