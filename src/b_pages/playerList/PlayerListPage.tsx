'use client';

/**
 * PlayerListPage — 선수 목록 페이지 조립 (ST-4).
 *
 * usePlayerListFilters(ST-2)의 상태를 각 섹션(ST-3A/3B)에 제어형으로 흘려보내기만 하는
 * 얇은 조립 컴포넌트. 로직은 model 레이어, 마크업은 ui 섹션에 있으므로 이 파일은 배선만 담당한다.
 *
 * Shell은 두 개 인스턴스로 나뉜다(ST-3A 인계): RosterHeadSection이 헤더 전용 Shell을 자체
 * 소유하고, FilterBarSection·ResultRow·결과 영역은 이 페이지가 공유하는 두 번째 Shell 안에서
 * 조립된다(디자인 소스의 두 번째 `.mu-shell` 대응). FilterBarSection의 옵션(POSITIONS·DECADES·
 * SQUADS)은 훅 반환값에 없으므로 mockData에서 가져와 props로 주입한다.
 *
 * Nav/Footer는 루트 레이아웃이 전역으로 공급하므로 여기서 렌더하지 않는다.
 */

import { Shell } from '@shared/ui';

import { DECADES, PLAYERS, POSITIONS, SQUADS, usePlayerListFilters } from './model';
import type { PlayerListItem } from './model';
import {
  FilterBarSection,
  ResultRow,
  RosterContent,
  RosterHeadSection,
} from './ui';

interface PlayerListPageProps {
  /** 렌더할 선수 목록. 미지정 시 목업 데이터(PLAYERS). 추후 API 데이터를 주입하거나 테스트 fixture로 대체한다. */
  players?: PlayerListItem[];
}

function PlayerListPage({ players = PLAYERS }: PlayerListPageProps = {}) {
  const roster = usePlayerListFilters(players);

  return (
    <main>
      <RosterHeadSection />
      <Shell>
        <FilterBarSection
          criteria={{
            position: roster.position,
            decade: roster.decade,
            squad: roster.squad,
            query: roster.query,
          }}
          positionOptions={POSITIONS}
          decadeOptions={DECADES}
          squadOptions={SQUADS}
          onPositionChange={roster.setPosition}
          onDecadeChange={roster.setDecade}
          onSquadChange={roster.setSquad}
          onQueryChange={roster.setQuery}
          onRefresh={roster.refresh}
        />
        <ResultRow count={roster.results.length} view={roster.view} onViewChange={roster.setView} />
        <RosterContent
          isLoading={roster.isLoading}
          results={roster.results}
          view={roster.view}
          onReset={roster.resetFilters}
        />
      </Shell>
    </main>
  );
}

export { PlayerListPage };
