'use client';

import { usePlayerProfile, usePlayerStatistics } from '@features/player/api';
import { Shell } from '@shared/ui';

import {
  buildCurrentSeasonSnapshot,
  mapProfileDtoToPlayerDetail,
  selectPrimaryStatistics,
  selectSeasonAggregate,
  selectSeasonRows,
} from './model';
import {
  // AttributeCard, // 능력치 카드 — 정규화 기준 부재로 비활성화, 추후 복원 예정(D-26)
  BackLink,
  CareerStatCards,
  CurrentSeasonCard,
  PlayerDetailSkeleton,
  PlayerHeader,
  PlayerNotFound,
  SeasonTable,
} from './ui';

// 시즌 선택 UI가 없어 페이지 로컬 상수로 고정한다(D-20, season 쿼리 파라미터 단일값).
const CURRENT_SEASON = 2025;

export interface PlayerDetailPageProps {
  playerId: string;
}

/**
 * 선수 상세 페이지 조립. PD-1의 usePlayerProfile/usePlayerStatistics로 실
 * API에 연결한다(2-콜 구조, D-19). playerId가 NaN이거나 두 쿼리 중 하나라도
 * 에러/데이터없음이면 PlayerNotFound를 렌더한다(D-24 — 레전드처럼 API에
 * 없는 id는 자연히 이 경로로 처리됨, 별도 분기 불필요).
 * 파생값(시즌표·시즌 합계·현재시즌 스냅샷)은 여기서 계산해 하위 컴포넌트에
 * props로 주입한다. Nav/Footer는 전역 layout이 렌더하므로 여기서 렌더하지 않는다.
 */
export function PlayerDetailPage({ playerId }: PlayerDetailPageProps) {
  const numericPlayerId = Number(playerId);
  const profileQuery = usePlayerProfile(numericPlayerId, CURRENT_SEASON);
  const statisticsQuery = usePlayerStatistics(numericPlayerId, CURRENT_SEASON);

  if (profileQuery.isLoading || statisticsQuery.isLoading) {
    return <PlayerDetailSkeleton />;
  }

  const isMissing =
    Number.isNaN(numericPlayerId) ||
    profileQuery.isError ||
    statisticsQuery.isError ||
    !profileQuery.data ||
    !statisticsQuery.data;

  if (isMissing) {
    return <PlayerNotFound />;
  }

  const player = mapProfileDtoToPlayerDetail(profileQuery.data, new Date());
  const seasonRows = selectSeasonRows(statisticsQuery.data);
  const career = selectSeasonAggregate(seasonRows);
  const primaryStatistics = selectPrimaryStatistics(statisticsQuery.data);
  const currentSeason = buildCurrentSeasonSnapshot(
    primaryStatistics,
    CURRENT_SEASON
  );
  const isGoalkeeper = player.pos === 'GK';

  return (
    <main>
      <Shell className="pb-16">
        <BackLink />
        <PlayerHeader player={player} />
        <CareerStatCards career={career} />
        {/* <AttributeCard radar={player.radar} ovr={player.ovr} /> 능력치 카드 — 정규화 기준 부재로 비활성화, 추후 복원 예정(D-26) */}
        <CurrentSeasonCard
          snapshot={currentSeason}
          isGoalkeeper={isGoalkeeper}
        />
        <SeasonTable rows={seasonRows} career={career} />
      </Shell>
    </main>
  );
}
