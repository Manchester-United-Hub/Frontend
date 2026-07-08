import { MapPin } from 'lucide-react';

import { Badge, ResultBadge } from '@shared/ui';
import { cn } from '@shared/utils';

import type { Fixture } from '../../model';
import { Crest } from '../Crest';

const UPCOMING_FALLBACK_LABEL = '예정';
/** 스코어 구분자 겸, 점수가 아직 없는 past 경기의 대체 표기. */
const SCORE_SEPARATOR = '–';

export interface FixtureRowProps {
  fixture: Fixture;
}

/**
 * FixtureRow — 일정 1행. design-ref `.fx-row`(6열 grid: 날짜·대회·홈팀·스코어·원정팀·경기장)를
 * 재현한다. ≤980px에서 대회·경기장 열을 숨기고 4열로 축약, ≤620px에서 폰트를 축소한다.
 * 팀 크레스트는 두 탭이 공유하는 `../Crest`(30px 원형)를 사용한다.
 */
export function FixtureRow({ fixture }: FixtureRowProps) {
  const isPast = fixture.status === 'past';
  const hasScore = fixture.home.score != null && fixture.away.score != null;

  return (
    <div
      className={cn(
        'grid min-h-[66px] grid-cols-[86px_122px_1fr_92px_1fr_132px] items-center gap-3.5 border-b border-border px-4.5 py-3 transition-colors hover:bg-accent',
        'max-[980px]:grid-cols-[72px_1fr_88px_1fr]'
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm font-bold text-foreground max-[620px]:text-[13px]">{fixture.date}</span>
        <span className="text-xs text-muted-foreground">{fixture.dow}</span>
      </div>

      <div className="flex flex-col gap-0.5 max-[980px]:hidden">
        <Badge variant="soft">{fixture.comp}</Badge>
        <span className="text-[11px] text-muted-foreground">{fixture.round}</span>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2">
        <span
          className={cn(
            'truncate text-right text-sm max-[620px]:text-xs',
            fixture.home.utd ? 'font-bold' : 'font-medium'
          )}
        >
          {fixture.home.nm}
        </span>
        <Crest code={fixture.home.code} utd={fixture.home.utd} />
      </div>

      <div className="flex flex-col items-center gap-1">
        {isPast ? (
          <>
            <span className="text-[19px] font-extrabold tracking-[-0.02em] max-[620px]:text-base">
              {hasScore
                ? `${fixture.home.score}${SCORE_SEPARATOR}${fixture.away.score}`
                : SCORE_SEPARATOR}
            </span>
            {fixture.result ? <ResultBadge result={fixture.result} /> : null}
          </>
        ) : (
          <>
            <span className="text-[13px] font-semibold text-foreground">{fixture.time}</span>
            <span className="text-[11px] text-muted-foreground">
              {fixture.countdown ?? UPCOMING_FALLBACK_LABEL}
            </span>
          </>
        )}
      </div>

      <div className="flex min-w-0 items-center justify-start gap-2">
        <Crest code={fixture.away.code} utd={fixture.away.utd} />
        <span
          className={cn(
            'truncate text-sm max-[620px]:text-xs',
            fixture.away.utd ? 'font-bold' : 'font-medium'
          )}
        >
          {fixture.away.nm}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground max-[980px]:hidden">
        <MapPin size={13} className="shrink-0" aria-hidden="true" />
        <span className="truncate">{fixture.venue}</span>
      </div>
    </div>
  );
}
