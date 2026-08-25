import { Suspense } from 'react';

import { getSeasonInfo } from '@entities/seasonInfo/api/server';
import { StandingsPanel, StandingSkeleton } from '@widgets/Standing/ui';
import { MatchesSkeleton, SchedulePanel } from '@widgets/MatchSchedule/ui';

import {
  SeasonHeader,
  SeasonTabs,
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
