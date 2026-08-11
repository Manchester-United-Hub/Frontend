import { seasonSummaryCards } from './model';
import { SeasonHeader, SeasonTabs, SummaryCards } from './ui';

interface SeasonPageProps {
  season: string;
}

export function SeasonPage({ season }: SeasonPageProps) {
  return (
    <main>
      <SeasonHeader season={season} />
      <SummaryCards summaryCards={seasonSummaryCards} />
      <SeasonTabs season={season} />
    </main>
  );
}
