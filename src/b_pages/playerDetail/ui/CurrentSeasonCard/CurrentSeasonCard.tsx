import { Footprints, Hash, Shield, Target, Trophy } from 'lucide-react';

import { Badge, Card } from '@shared/ui';

import type { SeasonSnapshot } from '../../model/types';
import { Donut } from '../charts/Donut';
import { Ring } from '../charts/Ring';
import { SeasonStatBar } from './SeasonStatBar';

const LEAGUE_MAX_APPS = 38;

/**
 * 현재(또는 마지막) 시즌 스냅샷 카드(`.cur-season`) — Card 셸 재사용 + 시안
 * 전용 padding은 className으로 흡수. GK는 Ring(출전/38) + 노트 문구, 그
 * 외는 Donut(득점/도움) + 득점·도움 바를 렌더한다(design_ref CurrentSeasonCard).
 */
export interface CurrentSeasonCardProps {
  snapshot: SeasonSnapshot;
  isGoalkeeper: boolean;
}

export function CurrentSeasonCard({ snapshot, isGoalkeeper }: CurrentSeasonCardProps) {
  const attackPointsMax = Math.max(snapshot.goals, snapshot.assists, 1);

  return (
    <Card padding="none" className="mt-[22px] p-5 md:p-[22px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-[15px] font-bold">
          {snapshot.title} <span className="font-medium text-muted-foreground">· {snapshot.szn}</span>
        </span>
        <Badge variant="soft">
          <Trophy size={12} />
          프리미어리그
        </Badge>
      </div>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[200px_1fr]">
        {isGoalkeeper ? (
          <Ring value={snapshot.apps} max={LEAGUE_MAX_APPS} label="출전" />
        ) : (
          <Donut goals={snapshot.goals} assists={snapshot.assists} />
        )}
        <div className="flex flex-col gap-[18px]">
          <SeasonStatBar
            icon={<Hash size={13} />}
            label="출전 경기"
            value={snapshot.apps}
            max={LEAGUE_MAX_APPS}
            sub={`/ ${LEAGUE_MAX_APPS}경기`}
            color="var(--foreground)"
          />
          {isGoalkeeper ? (
            <p className="flex items-center gap-[7px] py-2 text-[13px] text-muted-foreground">
              <Shield size={13} />
              골키퍼는 출전 중심으로 표시됩니다.
            </p>
          ) : (
            <>
              <SeasonStatBar
                icon={<Target size={13} />}
                label="득점"
                value={snapshot.goals}
                max={attackPointsMax}
                color="var(--united-red)"
              />
              <SeasonStatBar
                icon={<Footprints size={13} />}
                label="도움"
                value={snapshot.assists}
                max={attackPointsMax}
                color="var(--muted-foreground)"
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
