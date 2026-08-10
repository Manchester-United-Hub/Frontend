import { seasonSummaryCards } from './model';
import { SeasonHeader, SeasonTabs, SummaryCards } from './ui';

const SEASON = '2026-27';
export function SeasonPage() {
  return (
    <main>
      <SeasonHeader season={SEASON} />
      <SummaryCards summaryCards={seasonSummaryCards} />
      <SeasonTabs season={SEASON} />
    </main>
  );
}
