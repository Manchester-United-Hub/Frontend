import { CalendarDays, Clock } from 'lucide-react';

import { Button, Eyebrow, Shell } from '@shared/ui';
import { routes } from '@shared/utils';

const EYEBROW_TEXT = 'Match Centre';
const HEADLINE = '경기중에만 오픈됩니다.';
const GUIDE_LINES = [
  '지금은 경기 중인 내용이 없습니다.',
  '경기 중에만 라이브 페이지가 열립니다.',
] as const;
const SEASON_CTA_LABEL = '시즌 일정 보기';
const HOME_CTA_LABEL = '홈으로';

function ClosedView() {
  return (
    <main>
      <Shell className="grid place-items-center py-[120px] text-center max-[860px]:py-20">
        <div className="flex max-w-[560px] flex-col items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
            <Clock size={28} strokeWidth={1.75} aria-hidden="true" />
          </span>
          <Eyebrow className="mt-6">{EYEBROW_TEXT}</Eyebrow>
          <h1 className="mt-3 text-[36px] font-extrabold leading-[1.2] tracking-[-0.02em] max-[620px]:text-[28px]">
            {HEADLINE}
          </h1>
          <div className="mt-4 text-base leading-[1.6] text-muted-foreground">
            {GUIDE_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3 max-[620px]:w-full max-[620px]:flex-col max-[620px]:items-stretch">
            <Button mode="link" togo={routes.season()} variant="red" size="lg">
              <CalendarDays size={18} strokeWidth={1.75} aria-hidden="true" />
              {SEASON_CTA_LABEL}
            </Button>
            <Button mode="link" togo={routes.home()} variant="outline" size="lg">
              {HOME_CTA_LABEL}
            </Button>
          </div>
        </div>
      </Shell>
    </main>
  );
}

export { ClosedView };
