import { Suspense } from 'react';

import { getSeasonInfo } from '@features/seasonInfo/api';
import { StandingSkeleton } from '@widgets/Standing/ui';
import { MatchesSkeleton } from '@widgets/MatchSchedule/ui';

import {
  SchedulePanel,
  SeasonHeader,
  SeasonTabs,
  StandingsPanel,
  SummaryCardsSkeleton,
  SummaryPanel,
} from './ui';

export async function SeasonPage() {
  const { label, status, startYear } = await getSeasonInfo();

  return (
    <main>
      <SeasonHeader season={label} status={status} />
      <Suspense fallback={<SummaryCardsSkeleton />}>
        <SummaryPanel seasonStartYear={startYear} />
      </Suspense>
      <SeasonTabs
        matchesPanel={
          <Suspense fallback={<MatchesSkeleton season={label} />}>
            <SchedulePanel seasonLabel={label} seasonStartYear={startYear} />
          </Suspense>
        }
        standingsPanel={
          <Suspense fallback={<StandingSkeleton season={label} />}>
            <StandingsPanel seasonLabel={label} seasonStartYear={startYear} />
          </Suspense>
        }
      />
    </main>
  );
}
