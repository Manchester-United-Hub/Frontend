import { loadManager } from './api/loadManager';
import { clubIdentity, summaryCards } from './model/mockData';
import { ClubHeader, ClubTabs, SummaryCards } from './ui';

export async function ClubPage() {
  const manager = await loadManager();

  return (
    <>
      <main>
        <ClubHeader identity={clubIdentity} />
        <SummaryCards summaryCards={summaryCards} />
        <ClubTabs manager={manager} />
      </main>
    </>
  );
}
