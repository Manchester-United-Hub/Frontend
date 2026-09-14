import type { ReactNode } from 'react';
import { Users, CalendarDays } from 'lucide-react';

import type { HeroContent, HeroCta } from '../../model/types';
import { Button, Eyebrow } from '@shared/ui';
import { DARK_OUTLINE } from './styles';

/* ── 히어로 전용 아이콘 (모듈 스코프 호이스팅) ──────────────────────── */

const ICON_USERS = <Users size={18} strokeWidth={1.75} aria-hidden="true" />;
const ICON_CAL = (
  <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" />
);

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
  /**
   * FeaturedMatch 패널 슬롯. 데이터 유무·로딩·에러 분기는 이 슬롯을 채우는
   * FeaturedMatchContainer(ST-006)가 담당하고, HeroSection은 데이터를 모른다.
   */
  matchPanel: ReactNode;
}

export function HeroSection({ content, matchPanel }: HeroSectionProps) {
  const [before, accentText, after] = splitAtAccent(
    content.headline,
    content.accent
  );

  return (
    <section
      className="relative overflow-hidden bg-[var(--surface-hero)] text-white"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-shell grid-cols-[1.2fr_0.8fr] items-center gap-14 px-6 pb-16 pt-18 max-[860px]:grid-cols-1 max-[860px]:gap-9 max-[860px]:pb-10 max-[860px]:pt-12">
        {/* Left: hero copy */}
        <div>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1
            id="hero-heading"
            className="mt-4.5 text-[76px] font-extrabold leading-[1.12] tracking-[-0.03em] max-[860px]:text-[48px]"
          >
            <span className="break-keep">{before}</span>
            <span className="text-[#ff4133] whitespace-nowrap">
              {accentText}
            </span>
            <span className="break-keep">{after}</span>
          </h1>
          <p className="mt-5 break-keep text-[18px] leading-normal text-[#a1a1aa] min-[1200px]:max-w-160.5">
            {content.sub}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            {content.ctas.map((cta) =>
              cta.href != null ? (
                <Button
                  key={cta.label}
                  mode="link"
                  togo={cta.href}
                  variant={cta.variant}
                  size="lg"
                  className={
                    cta.variant === 'outline' ? DARK_OUTLINE : undefined
                  }
                >
                  {ctaIcon(cta.variant)}
                  {cta.label}
                </Button>
              ) : (
                <Button
                  key={cta.label}
                  mode="default"
                  variant={cta.variant}
                  size="lg"
                  className={
                    cta.variant === 'outline' ? DARK_OUTLINE : undefined
                  }
                >
                  {ctaIcon(cta.variant)}
                  {cta.label}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Right: FeaturedMatch panel */}
        {matchPanel}
      </div>
    </section>
  );
}
