import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Eyebrow } from '@shared/ui';
import { routes } from '@shared/utils';

const SECTION_HEADING_ID = 'squad-heading';

export function SquadPreviewHeader() {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <Eyebrow>First Team</Eyebrow>
        <h2
          id={SECTION_HEADING_ID}
          className="mt-1.5 text-[28px] font-bold leading-[1.1] tracking-[-0.02em]"
        >
          1군 스쿼드
        </h2>
      </div>
      <Link
        href={routes.players()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        역대 선수 목록
        <ArrowRight size={16} aria-hidden />
      </Link>
    </div>
  );
}

export { SECTION_HEADING_ID };
