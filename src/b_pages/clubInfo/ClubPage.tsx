import { loadManager } from './api/loadManager';
import { buildCoachSummaryCard } from './model/buildCoachSummaryCard';
import { clubIdentity, summaryCards } from './model/mockData';
import { ClubHeader, ClubTabs, SummaryCards } from './ui';

export async function ClubPage() {
  const manager = await loadManager();
  const clubSummaryCards = [...summaryCards, buildCoachSummaryCard(manager)];

  return (
    <>
      <main>
        <ClubHeader identity={clubIdentity} />
        <SummaryCards summaryCards={clubSummaryCards} />
        <ClubTabs manager={manager} />
      </main>
    </>
  );
}
