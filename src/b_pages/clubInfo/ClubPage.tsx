import { clubIdentity, summaryCards } from './model/mockData';
import { ClubHeader, ClubTabs, SummaryCards } from './ui';

export function ClubPage() {
  return (
    <>
      <main>
        <ClubHeader identity={clubIdentity} />
        <SummaryCards summaryCards={summaryCards} />
        <ClubTabs />
      </main>
    </>
  );
}
