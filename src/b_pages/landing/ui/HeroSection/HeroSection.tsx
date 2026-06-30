import type { ReactNode } from 'react';
import { Users, CalendarDays } from 'lucide-react';

import type { HeroContent, HeroCta } from '../../model/types';
import type { MatchItem } from '../../model/types';
import { Button, Eyebrow } from '@shared/ui';
import { FeaturedMatchPanel } from './FeaturedMatchPanel';
import { DARK_OUTLINE } from './styles';

/* ── 히어로 전용 아이콘 (모듈 스코프 호이스팅) ──────────────────────── */

const ICON_USERS = <Users size={18} strokeWidth={1.75} aria-hidden="true" />;
const ICON_CAL = <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" />;

function splitAtAccent(text: string, accent: string): [string, string, string] {
  const i = text.indexOf(accent);
  if (i === -1) return [text, '', ''];
  return [text.slice(0, i), accent, text.slice(i + accent.length)];
}

function ctaIcon(variant: HeroCta['variant']): ReactNode {
  return variant === 'red' ? ICON_USERS : ICON_CAL;
}

/* ── 컴포넌트 ─────────────────────────────────────────────────────── */

export interface HeroSectionProps {
  content: HeroContent;
  nextMatch: MatchItem;
}

export function HeroSection({ content, nextMatch }: HeroSectionProps) {
  const [before, accentText, after] = splitAtAccent(content.headline, content.accent);

  return (
    <section
      className="relative overflow-hidden bg-[#0b0b0d] text-white"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-[1.2fr_0.8fr] items-center gap-14 px-6 pb-16 pt-[72px] max-[860px]:grid-cols-1 max-[860px]:gap-9 max-[860px]:pb-10 max-[860px]:pt-12">

        {/* Left: hero copy */}
        <div className="max-w-[540px]">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1
            id="hero-heading"
            className="mt-[18px] text-[76px] font-extrabold leading-[1.12] tracking-[-0.03em] max-[860px]:text-[48px]"
          >
            {before}
            <span className="text-[#ff4133]">{accentText}</span>
            {after}
          </h1>
          <p className="mt-5 max-w-[460px] text-[18px] leading-[1.5] text-[#a1a1aa]">
            {content.sub}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {content.ctas.map((cta) =>
              cta.href != null ? (
                <Button key={cta.label} mode="link" togo={cta.href} variant={cta.variant} size="lg"
                  className={cta.variant === 'outline' ? DARK_OUTLINE : undefined}>
                  {ctaIcon(cta.variant)}{cta.label}
                </Button>
              ) : (
                <Button key={cta.label} mode="default" variant={cta.variant} size="lg"
                  className={cta.variant === 'outline' ? DARK_OUTLINE : undefined}>
                  {ctaIcon(cta.variant)}{cta.label}
                </Button>
              ),
            )}
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-7 border-t border-[#27272a] pt-7 max-[620px]:gap-[18px]">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-[26px] font-extrabold tracking-[-0.02em]">
                  {stat.num}
                  {stat.unit !== '' ? (
                    <span className="text-united-red">{stat.unit}</span>
                  ) : null}
                </div>
                <div className="mt-0.5 text-[12px] tracking-[0.04em] text-[#a1a1aa]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: FeaturedMatch panel */}
        <FeaturedMatchPanel match={nextMatch} />
      </div>
    </section>
  );
}
