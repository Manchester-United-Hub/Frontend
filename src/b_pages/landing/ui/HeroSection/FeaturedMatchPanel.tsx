import { CalendarDays, Bell, MapPin, Clock } from 'lucide-react';
import type { MatchItem } from '../../model/types';
import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { DARK_OUTLINE } from './styles';

/* ── 패널 전용 아이콘 (모듈 스코프 호이스팅) ─────────────────────────── */

const ICON_CAL_SM = <CalendarDays size={14} strokeWidth={1.75} aria-hidden="true" />;
const ICON_BELL = <Bell size={16} strokeWidth={1.75} aria-hidden="true" />;
const ICON_MAP = <MapPin size={15} strokeWidth={1.75} aria-hidden="true" />;
const ICON_CLOCK = <Clock size={15} strokeWidth={1.75} aria-hidden="true" />;

/* ── 컴포넌트 ─────────────────────────────────────────────────────── */

export interface FeaturedMatchPanelProps {
  match: MatchItem;
  className?: string;
}

export function FeaturedMatchPanel({ match, className }: FeaturedMatchPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[#27272a] p-6 text-white shadow-md',
        className,
      )}
      style={{ backgroundColor: 'var(--footer-bg)' }}
    >
      {/* Top: competition + next-match badge */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a1a1aa]">
          {ICON_CAL_SM}{match.competition}
        </span>
        <span className="inline-flex h-[22px] items-center gap-1.5 rounded-md bg-united-red px-[9px] text-[12px] font-semibold leading-none text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" aria-hidden="true" />
          다음 경기
        </span>
      </div>

      {/* Teams */}
      <div className="my-7 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-united-red text-lg font-extrabold text-white">
            {match.home.code}
          </span>
          <span className="text-[13px] font-semibold">{match.home.name}</span>
        </div>
        <span className="text-[22px] font-extrabold tracking-[0.02em] text-[#a1a1aa]">VS</span>
        <div className="flex flex-col items-center gap-2.5 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2f2f35] bg-[#1f1f23] text-lg font-extrabold text-white">
            {match.away.code}
          </span>
          <span className="text-[13px] font-semibold">{match.away.name}</span>
        </div>
      </div>

      {/* Meta: venue + datetime */}
      <div className="flex items-center justify-center gap-[18px] border-b border-t border-[#27272a] py-3.5 text-[13px] text-[#a1a1aa]">
        <span className="flex items-center gap-1.5">{ICON_MAP}{match.venue}</span>
        <span className="flex items-center gap-1.5">
          {ICON_CLOCK}{match.date}{match.time != null ? ` ${match.time}` : ''}
        </span>
      </div>

      {/* Actions */}
      <div className="relative z-10 mt-[18px] flex gap-2.5">
        <Button mode="default" variant="red" size="default" className="flex-1">
          {ICON_BELL}경기 알림 받기
        </Button>
        <Button mode="default" variant="outline" size="default" className={DARK_OUTLINE}>
          {match.countdown ?? '—'}
        </Button>
      </div>
    </div>
  );
}
