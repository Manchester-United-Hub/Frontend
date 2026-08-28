/**
 * PlayerListPage — 선수 목록 페이지 조립(ST-4, widget 병합 전용 서버 컴포넌트).
 *
 * 데이터 조회·필터·상태 로직은 전부 c_widgets/PlayerRoster의 RosterPanel로 옮겨졌다(ST-4).
 * 이 페이지는 RosterHeadSection과 RosterPanel을 병합하고, app/players/page.tsx가 서버에서
 * getSeasonInfo()로 확정한 season을 RosterPanel에 prop으로 전달한다(A-4/S-9 — 이 페이지·
 * RosterPanel 어디에서도 useCurrentSeason()을 호출하지 않는다).
 *
 * Shell은 두 개 인스턴스로 나뉜다(ST-3A 인계): RosterHeadSection이 헤더 전용 Shell을 자체
 * 소유하고, RosterPanel(FilterBarSection·ResultRow·결과 영역)은 이 페이지가 소유하는 두 번째
 * Shell 안에서 조립된다(디자인 소스의 두 번째 `.mu-shell` 대응).
 *
 * Nav/Footer는 루트 레이아웃이 전역으로 공급하므로 여기서 렌더하지 않는다.
 */

import { RosterHeadSection, RosterPanel } from '@widgets/PlayerRoster/ui';
import { Shell } from '@shared/ui';

interface PlayerListPageProps {
  season: number;
}

function PlayerListPage({ season }: PlayerListPageProps) {
  return (
    <main>
      <RosterHeadSection />
      <Shell>
        <RosterPanel season={season} />
      </Shell>
    </main>
  );
}

export { PlayerListPage };
