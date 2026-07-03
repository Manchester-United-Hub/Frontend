import { Badge, Card } from '@shared/ui';

import type { SquadPlayer } from '../../model/types';
import { LineupRow } from './LineupRow';

interface LineupListProps {
  lineup: SquadPlayer[];
  subs: SquadPlayer[];
  /** 카드 헤더에 표시할 현재 포메이션 라벨(예: "4-3-3"). */
  formationLabel: string;
}

/** 우측 선발/후보 리스트 카드 — lineup·subs를 받아 표시만 하는 표현 전용 컴포넌트. */
const LineupList = ({ lineup, subs, formationLabel }: LineupListProps) => (
  <div className="lg:sticky lg:top-[132px]">
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <span className="text-sm font-bold">선발 라인업</span>
        <Badge variant="position">{formationLabel}</Badge>
      </div>
      {lineup.map((player) => (
        <LineupRow key={player.num} player={player} />
      ))}
      <div className="px-4 pb-1.5 pt-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        후보 · Substitutes
      </div>
      {subs.map((player) => (
        <LineupRow key={player.num} player={player} />
      ))}
    </Card>
  </div>
);

export { LineupList, type LineupListProps };
