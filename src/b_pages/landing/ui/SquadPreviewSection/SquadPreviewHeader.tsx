import { ArrowRight } from 'lucide-react';
import { Eyebrow } from '@shared/ui';

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
      {/* 유효 라우트 미존재 → 비링크(span) 처리 (ADR-7) */}
      <span className="inline-flex cursor-default items-center gap-1.5 text-sm font-medium text-muted-foreground">
        역대 선수 목록
        <ArrowRight size={16} aria-hidden />
      </span>
    </div>
  );
}

export { SECTION_HEADING_ID };
