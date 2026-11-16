import { buildCoachSummaryCard } from './model/buildCoachSummaryCard';
import { clubIdentity, summaryCards } from './model/mockData';
import type { Manager } from './model/types';
import { ClubHeader, ClubTabs, SummaryCards } from './ui';

export interface ClubPageProps {
  /** 감독 API 결과(라우트에서 loadManager로 조회). 실패 시 null. */
  manager: Manager | null;
}

export function ClubPage({ manager }: ClubPageProps) {
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
