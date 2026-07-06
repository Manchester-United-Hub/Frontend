import Link from 'next/link';

import { Badge } from '@shared/ui';
import { cn } from '@shared/utils';

import { FLAG_EMOJI } from '../../model/mockData';
import { playerDetailHref } from '../../model/playerDetailHref';
import type { PlayerListItem } from '../../model/types';
import { ROSTER_ROW_GRID_CLASSNAME } from './RosterListView';

interface RosterListRowProps {
  player: PlayerListItem;
}

/** 리스트뷰 행 — 등번호·이름·포지션·국적·연도·상태를 한 행에, 행 전체가 선수별 Link(ADR-5). */
function RosterListRow({ player }: RosterListRowProps) {
  const isRetired = player.status === 'retired';

  return (
    <Link
      href={playerDetailHref(player.id)}
      className={cn(
        ROSTER_ROW_GRID_CLASSNAME,
        'h-16 border-b border-border text-inherit no-underline transition-colors last:border-b-0 hover:bg-accent',
      )}
    >
      <span className="text-center text-base font-extrabold text-united-red">
        {player.number}
      </span>
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold">{player.name}</span>
        <span className="text-xs text-muted-foreground">{player.nameEn}</span>
      </span>
      <span className="max-[620px]:hidden">
        <Badge variant="soft">{player.position}</Badge>
      </span>
      <span className="flex items-center gap-2 text-sm text-muted-foreground max-[980px]:hidden">
        <span aria-hidden="true">{FLAG_EMOJI[player.flagCode]}</span>
        {player.nationality}
      </span>
      <span className="text-sm text-muted-foreground">{player.years}</span>
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            isRetired ? 'bg-muted-foreground' : 'bg-win',
          )}
        />
        {isRetired ? '은퇴' : '현역'}
      </span>
    </Link>
  );
}

export { RosterListRow, type RosterListRowProps };
