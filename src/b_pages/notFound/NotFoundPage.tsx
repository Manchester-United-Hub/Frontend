import { ChevronLeft } from 'lucide-react';

import { Badge, Button, Shell } from '@shared/ui';

import { GoBackButton } from './ui';

const ICON_CHEVRON_LEFT = (
  <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
);

const WATERMARK_TEXT = '404';
const HEADLINE_LEAD = '이 패스는 ';
const HEADLINE_ACCENT = '타겟을 벗어났습니다';
const SUBCOPY =
  '요청한 페이지가 이동되었거나 삭제되었을 수 있어요. 상단 메뉴에서 원하는 정보로 바로 이동하거나, 홈으로 돌아가 주세요.';
const HOME_CTA_LABEL = '홈으로 돌아가기';
const STATUS_BADGE_TEXT = 'HTTP 404';
const CONTACT_PREFIX = '문제가 계속되면 ';
const CONTACT_ACTION = '문의하기';
const CONTACT_SUFFIX = '로 알려주세요.';

export function NotFoundPage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[440px] font-extrabold leading-[0.8] tracking-[-0.06em] text-foreground/5 max-[1024px]:text-[300px] max-[620px]:text-[200px]"
        >
          {WATERMARK_TEXT}
        </span>
        <Shell className="grid place-items-center pt-[120px] pb-[116px] text-center max-[860px]:pt-20 max-[860px]:pb-[76px]">
          <div className="relative flex max-w-[620px] flex-col items-center">
            <h1 className="mt-[18px] text-[52px] font-extrabold leading-[1.14] tracking-[-0.03em] max-[1024px]:text-[42px] max-[620px]:text-[34px]">
              {HEADLINE_LEAD}
              <span className="text-united-red">{HEADLINE_ACCENT}</span>
            </h1>
            <p className="mt-5 text-[18px] leading-[1.5] text-muted-foreground">
              {SUBCOPY}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 max-[620px]:w-full max-[620px]:flex-col max-[620px]:items-stretch">
              <Button mode="link" togo="/" variant="red" size="lg">
                {ICON_CHEVRON_LEFT}
                {HOME_CTA_LABEL}
              </Button>
              <GoBackButton />
            </div>
            <p className="mt-9 flex w-full max-w-[420px] flex-wrap items-center justify-center gap-2.5 border-t border-border pt-6 text-[13px] text-muted-foreground">
              <Badge variant="soft">{STATUS_BADGE_TEXT}</Badge>
              <span>
                {CONTACT_PREFIX}
                <span className="font-medium text-united-red">{CONTACT_ACTION}</span>
                {CONTACT_SUFFIX}
              </span>
            </p>
          </div>
        </Shell>
      </section>
    </main>
  );
}
