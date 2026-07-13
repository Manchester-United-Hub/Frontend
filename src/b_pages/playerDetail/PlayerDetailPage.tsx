import { Shell } from '@shared/ui';

import { deriveCurrentSeason, deriveSeasonRows, getPlayerById } from './model';
import {
  AttributeCard,
  BackLink,
  CareerStatCards,
  CurrentSeasonCard,
  PlayerHeader,
  PlayerNotFound,
  SeasonTable,
} from './ui';

export interface PlayerDetailPageProps {
  playerId: string;
}

/**
 * 선수 상세 페이지 조립(design_ref player-detail.jsx `DetailApp`).
 * getPlayerById 실패 시 PlayerNotFound, 성공 시 BackLink→PlayerHeader→
 * CareerStatCards→AttributeCard→CurrentSeasonCard→SeasonTable 순으로 조립한다.
 * 파생값(시즌표·현재시즌 스냅샷)은 여기서 계산해 하위 컴포넌트에 props로 주입한다.
 * Nav/Footer는 전역 layout이 렌더하므로 여기서 렌더하지 않는다.
 */
export function PlayerDetailPage({ playerId }: PlayerDetailPageProps) {
  const player = getPlayerById(playerId);

  if (!player) {
    return <PlayerNotFound />;
  }

  const seasonRows = deriveSeasonRows(player);
  const currentSeason = deriveCurrentSeason(player);
  const isGoalkeeper = player.pos === 'GK';

  return (
    <main>
      <Shell className="pb-16">
        <BackLink />
        <PlayerHeader player={player} />
        <CareerStatCards career={player.career} trophies={player.trophies} />
        <AttributeCard radar={player.radar} ovr={player.ovr} />
        <CurrentSeasonCard snapshot={currentSeason} isGoalkeeper={isGoalkeeper} />
        <SeasonTable rows={seasonRows} career={player.career} />
      </Shell>
    </main>
  );
}
