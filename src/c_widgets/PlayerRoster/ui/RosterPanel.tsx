'use client';

/**
 * RosterPanel — 선수 목록 조립 본체(ST-4로 PlayerListPage에서 위젯 계층으로 이동).
 *
 * usePlayerList(d_features/player)로 받은 `PlyaerListDTO`(BFF 봉투는 playerQueries.ts의
 * queryFn이 이미 언랩해 반환한다, S-6)의 `players`를 mapPlayerDtoToListItem으로 변환해
 * usePlayerListFilters(클라이언트 필터/검색/뷰 상태, ST-2)에 흘려보낸다.
 *
 * season은 app/players/page.tsx가 서버에서 getSeasonInfo()로 확정해 prop으로 내린다(A-4/S-9)
 * — 이 컴포넌트는 useCurrentSeason()을 호출하지 않고 enabled 게이팅도 하지 않는다. 쿼리 객체는
 * 서버 prefetch(playerServerQueries)와 동일한 rosterListQuery(season) 팩토리로만 만든다(A-5/S-5).
 *
 * 로딩/에러는 usePlayerList(react-query)의 상태를 그대로 RosterContent에 매핑한다. BFF 에러
 * 봉투(success:false)는 playerQueries.ts의 queryFn이 이미 throw로 정규화해 react-query의
 * isError로 전이시키므로, 이 컴포넌트에서 별도로 감지하지 않는다(옛 isBffError 분기 삭제, S-6).
 * "새로고침" 버튼은 usePlayerListFilters의 기존 스켈레톤 연출(refresh)과 실제 refetch를 함께
 * 트리거한다 — 두 개념을 합치지 않고 그대로 병행하는 것이 usePlayerListFilters.ts 무수정
 * 원칙에 부합한다.
 *
 * 결과는 usePlayerListFilters가 페이지 단위로 잘라 준다(pageResults) — 페이저는 RosterContent가
 * 결과 분기에서만 렌더한다. 결과 카운트("총 N명")는 페이지 조각이 아니라 필터를 통과한 전체
 * 결과 수(results)를 쓴다.
 *
 * 페이지 크기는 useRosterPageSize()가 뷰포트 폭(모바일 6 / 태블릿 8 / PC 10)에 따라 계산해
 * usePlayerListFilters에 주입한다(A-2/A-8). 같은 pageSize를 RosterContent의 skeletonCount로도
 * 넘겨, 로딩 스켈레톤 카드 수가 실제로 노출될 카드 수와 뷰포트별로 일치하게 한다(S-14).
 *
 * Shell 래핑은 이 컴포넌트가 소유하지 않는다 — PlayerListPage가 공유 Shell 안에서 이 컴포넌트를
 * 렌더한다(헤더 전용 Shell은 RosterHeadSection이 별도로 자체 소유한다).
 */

import { useMemo } from 'react';

import { rosterListQuery, usePlayerList } from '@features/player/api';
import { mapPlayerDtoToListItem } from '@entities/player/utils';

import { POSITIONS, usePlayerListFilters, useRosterPageSize } from '@features/player/model';
import { FilterBarSection, ResultRow } from '@features/player/ui';
import { RosterContent } from './RosterContent';

interface RosterPanelProps {
  season: number;
}

function RosterPanel({ season }: RosterPanelProps) {
  const { data, isLoading, isError, refetch } = usePlayerList(rosterListQuery(season));
  const players = useMemo(
    () => (data ? data.players.map(mapPlayerDtoToListItem) : []),
    [data]
  );
  const pageSize = useRosterPageSize();
  const roster = usePlayerListFilters(players, pageSize);

  const handleRefresh = () => {
    roster.refresh();
    refetch();
  };

  return (
    <>
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
      <ResultRow
        count={roster.results.length}
        page={roster.page}
        totalPages={roster.totalPages}
        view={roster.view}
        onViewChange={roster.setView}
      />
      <RosterContent
        isLoading={isLoading || roster.isLoading}
        isError={isError}
        results={roster.pageResults}
        view={roster.view}
        onReset={roster.resetFilters}
        onRetry={refetch}
        skeletonCount={pageSize}
        pagination={{
          page: roster.page,
          totalPages: roster.totalPages,
          onPageChange: roster.setPage,
        }}
      />
    </>
  );
}

export { RosterPanel };
