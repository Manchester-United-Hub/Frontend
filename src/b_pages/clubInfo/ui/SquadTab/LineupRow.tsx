import { BilingualLabel } from '@shared/ui';

import type { SquadPlayer } from '../../model/types';

interface LineupRowProps {
  player: SquadPlayer;
}

/** 선발/후보 리스트의 행 1개 — 등번호·이름(국문+영문)·포지션 배지. */
const LineupRow = ({ player }: LineupRowProps) => (
  <div className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-b-0">
    <span className="w-[26px] text-center text-sm font-extrabold text-united-red">
      {player.num}
    </span>
    <BilingualLabel
      kr={player.nm}
      en={player.en}
      align="start"
      className="flex-1 flex-row items-baseline gap-1 text-sm font-medium"
      enClassName="text-[11px] normal-case tracking-normal text-muted-foreground"
    />
    <span className="rounded-sm bg-muted px-[7px] py-0.5 text-[11px] font-semibold text-muted-foreground">
      {player.role}
    </span>
  </div>
);

export { LineupRow, type LineupRowProps };
