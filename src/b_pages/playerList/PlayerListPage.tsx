'use client';

/**
 * PlayerListPage — 선수 목록 페이지 조립 (ST-4, PL-2로 실 API 연결·decision-1.md D-31).
 *
 * usePlayerList(d_features/player)로 받은 `PyaerListDTO`(페이지 봉투)의 `players`를
 * mapPlayerDtoToListItem으로 변환해
 * usePlayerListFilters(클라이언트 필터/검색/뷰 상태, ST-2)에 흘려보낸다. BffApiResponse 언랩은
 * 이 페이지에서 직접 처리한다(playerQueries.ts의 list는 미수정 — sharedLayerOwnership 참조).
 *
 * 로딩/에러는 react-query 상태를 RosterContent에 그대로 매핑한다. "새로고침" 버튼은
 * usePlayerListFilters의 기존 스켈레톤 연출(refresh)과 실제 refetch를 함께 트리거한다 —
 * 두 개념을 합치지 않고 그대로 병행하는 것이 usePlayerListFilters.ts 무수정 원칙(decision-1.md)에
 * 부합한다.
 *
 * Shell은 두 개 인스턴스로 나뉜다(ST-3A 인계): RosterHeadSection이 헤더 전용 Shell을 자체
 * 소유하고, FilterBarSection·ResultRow·결과 영역은 이 페이지가 공유하는 두 번째 Shell 안에서
 * 조립된다(디자인 소스의 두 번째 `.mu-shell` 대응). FilterBarSection의 포지션 옵션(POSITIONS)은
 * 훅 반환값에 없으므로 model/positionOptions.ts에서 가져와 props로 주입한다(목데이터가 아니라
 * production UI 상수 — 목데이터 이관 작업으로 mockData.ts에서 분리됨). 활약연도·스쿼드는 실
 * 데이터에 근거가 없어 옵션 자체가 없다(DECADES/SQUADS 삭제됨) — 이 페이지는 두 prop을 아예
 * 넘기지 않고, FilterBarSection이 옵션 미지정 시 해당 셀렉트를 렌더하지 않는다(리뷰 H-3,
 * "고장난 필터"처럼 보이는 빈 셀렉트 노출 방지).
 *
 * Nav/Footer는 루트 레이아웃이 전역으로 공급하므로 여기서 렌더하지 않는다.
 */

import { useMemo } from 'react';

import { usePlayerList } from '@features/player/api';
import { MAX_PAGE_SIZE } from '@entities/player/model';
import { Shell } from '@shared/ui';

import { POSITIONS, mapPlayerDtoToListItem, usePlayerListFilters } from './model';
import {
  FilterBarSection,
  ResultRow,
  RosterContent,
  RosterHeadSection,
} from './ui';

/** `/api/players`의 season은 선택 파라미터지만 이 페이지는 현 시즌 스쿼드만 노출한다(D-13, 페이지 로컬 상수). */
const CURRENT_SEASON = 2025;
/** 페이지네이션 UI가 없으므로 계약 상한(size=100)으로 한 시즌 스쿼드를 한 번에 받는다. */
const PLAYER_LIST_PAGE_SIZE = MAX_PAGE_SIZE;

function PlayerListPage() {
  const { data, isLoading, isError, refetch } = usePlayerList({
    season: CURRENT_SEASON,
    size: PLAYER_LIST_PAGE_SIZE,
  });
  const players = useMemo(
    () => (data?.success ? data.data.players.map(mapPlayerDtoToListItem) : []),
    [data],
  );
  const roster = usePlayerListFilters(players);
  // playerQueries.ts의 list는 !success에서 throw하지 않는 예외라(AD-1, D-7) react-query가
  // reject되지 않는다 — 이 페이지에서 BFF 에러 봉투를 직접 감지해 에러 상태로 전이한다(리뷰 H-1).
  const isBffError = data !== undefined && !data.success;

  const handleRefresh = () => {
    roster.refresh();
    refetch();
  };

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
          onPositionChange={roster.setPosition}
          onDecadeChange={roster.setDecade}
          onSquadChange={roster.setSquad}
          onQueryChange={roster.setQuery}
          onRefresh={handleRefresh}
        />
        <ResultRow count={roster.results.length} view={roster.view} onViewChange={roster.setView} />
        <RosterContent
          isLoading={isLoading || roster.isLoading}
          isError={isError || isBffError}
          results={roster.results}
          view={roster.view}
          onReset={roster.resetFilters}
          onRetry={refetch}
        />
      </Shell>
    </main>
  );
}

export { PlayerListPage };
