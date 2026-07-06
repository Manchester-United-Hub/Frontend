import { CalendarDays, Hash } from 'lucide-react';

import { Badge, Eyebrow } from '@shared/ui';
import { cn } from '@shared/utils';

import type { PlayerDetail } from '../../model/types';
import { PlayerInfoGrid, POSITION_LABEL } from './PlayerInfoGrid';
import { PlayerPhoto } from './PlayerPhoto';

export interface PlayerHeaderProps {
  player: PlayerDetail;
}

/**
 * pd-head — 사진 컬럼(PlayerPhoto) + 정보 컬럼(Eyebrow·이름·태그·PlayerInfoGrid).
 * design_ref player-detail.jsx `DetailApp`의 `.pd-head`/`.pd-id`가 정답지.
 * Nav/Footer는 전역 layout이 렌더하므로 여기서 렌더하지 않는다.
 */
export function PlayerHeader({ player }: PlayerHeaderProps) {
  const retired = player.status === 'retired';

  return (
    <div className="grid grid-cols-1 items-start gap-5 pb-2 pt-5 min-[980px]:grid-cols-[280px_1fr] min-[980px]:gap-8">
      <PlayerPhoto player={player} />

      <div>
        <Eyebrow>
          {player.squad} · {retired ? 'Former Player' : 'First Team'}
        </Eyebrow>

        <div className="mt-2 flex flex-wrap items-baseline gap-3.5">
          <span className="text-[30px] font-extrabold tracking-[-0.02em] text-united-red">#{player.num}</span>
          <h1 className="text-[30px] font-extrabold leading-[1.05] tracking-[-0.025em] min-[620px]:text-[40px]">
            {player.nm}
          </h1>
          {player.captain ? (
            <Badge variant="position" className="self-center">
              주장 · C
            </Badge>
          ) : null}
        </div>

        <div className="mt-1 text-base text-muted-foreground">{player.en}</div>

        <div className="mt-3.5 flex flex-wrap gap-2">
          <Badge>
            <Hash size={13} aria-hidden="true" />
            {POSITION_LABEL[player.pos]}
          </Badge>
          <Badge variant="soft">
            <CalendarDays size={13} aria-hidden="true" />
            {player.years}
          </Badge>
          <Badge
            variant={retired ? 'soft' : undefined}
            className={cn(!retired && 'border-transparent bg-win/14 text-win')}
          >
            <span
              aria-hidden="true"
              className={cn('inline-block h-1.5 w-1.5 rounded-full', retired ? 'bg-muted-foreground' : 'bg-win')}
            />
            {retired ? '은퇴' : '현역'}
          </Badge>
        </div>

        <PlayerInfoGrid player={player} />
      </div>
    </div>
  );
}
