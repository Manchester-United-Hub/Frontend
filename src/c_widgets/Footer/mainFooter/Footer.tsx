import { cn } from '@shared/utils';
import { FooterLinkCol, FooterLogo } from './ui';

// Static footer content — widget is self-contained (FSD: b_pages model import prohibited)
const FOOTER_COLS = [
  { heading: '둘러보기', links: ['시즌', '선수', '구단', '하이라이트'] },
  { heading: '구단', links: ['연혁', '홈구장', '감독', '팀 통계'] },
  { heading: '더보기', links: ['기사', '검색', 'RSS', '문의'] },
] as const;

function MainFooter() {
  return (
    <footer
      className={cn('text-[#e7e7ea]', 'mt-[44px] min-[621px]:mt-6')}
      style={{ backgroundColor: 'var(--footer-bg)' }}
    >
      {/* Inner grid: branding column + 3 link columns
          Breakpoints from man-united.css:
          >860px → 4 cols (1.4fr 1fr 1fr 1fr) | ≤860px → 2 cols | ≤620px → 1 col */}
      <div
        className={cn(
          'max-w-[1200px] mx-auto px-6',
          'grid gap-7 min-[861px]:gap-10',
          'pt-11 min-[621px]:pt-14',
          'pb-8 min-[621px]:pb-10',
          'grid-cols-1 min-[621px]:grid-cols-2 min-[861px]:grid-cols-[1.4fr_1fr_1fr_1fr]',
        )}
      >
        {/* Branding column */}
        <div>
          <FooterLogo />
          <p className="text-[14px] leading-relaxed text-[#a1a1aa] mt-4 mb-0 max-w-[300px]">
            팬이 만든 비공식 맨체스터 유나이티드 정보 허브. 경기·선수·구단의 모든 기록을 빠르게.
          </p>
        </div>

        {/* Link columns */}
        {FOOTER_COLS.map((col) => (
          <FooterLinkCol key={col.heading} heading={col.heading} links={col.links} />
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className={cn(
          'max-w-[1200px] mx-auto px-6',
          'border-t border-[#27272a]',
          'pt-[18px] pb-10',
          'flex flex-wrap items-center justify-between gap-4',
          'text-[13px] text-[#71717a]',
        )}
      >
        <span className="max-w-[640px]">
          © 2026 Manchester United FC Hub — 팬 제작 비공식 사이트. 구단 공식 자산과 무관합니다.
        </span>
        <span>Glory Glory Man United</span>
      </div>
    </footer>
  );
}

export { MainFooter };
