'use client';

import { Inbox } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { rosterListQuery, useSuspensePlayerList } from '@features/player/api';
import { PlayerCard, StateBox } from '@shared/ui';

import { selectSquadPreview } from '../../model/selectSquadPreview';
import { RosterCardPhoto } from '@entities/player/ui/RosterGrid/RosterCardPhoto';
import { playerDetailHref } from '@entities/player/model';

const EMPTY_BOX = (
  <StateBox
    variant="empty"
    icon={<Inbox size={22} aria-hidden />}
    title="등록된 선수가 없어요"
    description="시즌 명단이 확정되면 여기에 표시됩니다."
  />
);

export interface SquadPreviewSectionProps {
  season: number;
}

export function SquadPreviewSection({ season }: SquadPreviewSectionProps) {
  const { data } = useSuspensePlayerList(rosterListQuery(season));
  const players = useMemo(() => selectSquadPreview(data), [data]);

  if (players.length === 0) return EMPTY_BOX;

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
    >
      {players.map((player) => (
        <li key={player.id}>
          <Link href={playerDetailHref(player.id)} className="block h-full">
            <PlayerCard
              name={player.name}
              nameEn={player.nameEn}
              position={player.position ?? '-'}
              number={player.number}
              status={player.status}
              meta={player.years || undefined}
              photo={
                player.photo ? (
                  <RosterCardPhoto
                    src={player.photo}
                    alt={player.name}
                    className="rounded-full "
                  />
                ) : undefined
              }
              className="h-full"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
