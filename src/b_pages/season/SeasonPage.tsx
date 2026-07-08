import { seasonSummaryCards } from './model';
import { SeasonHeader, SeasonTabs, SummaryCards } from './ui';

/** SeasonPage — 시즌 페이지 조립(main > Header + SummaryCards + Tabs). clubInfo `ClubPage`를 그대로 미러링했다(plan.md). */
export function SeasonPage() {
  return (
    <main>
      <SeasonHeader />
      <SummaryCards summaryCards={seasonSummaryCards} />
      <SeasonTabs />
    </main>
  );
}
