import Link from 'next/link';

import { UnitedShield } from '@shared/ui';

// ── 서브컴포넌트 (모듈 스코프 — 컴포넌트 내부 정의 금지) ──────────────────

function LogoBlock() {
  return (
    <Link
      href="/"
      aria-label="맨체스터 유나이티드 FC HUB 홈으로"
      className="flex items-center gap-2.5 shrink-0"
    >
      <span className="w-8.5 h-8.5 flex-none grid place-items-center">
        <UnitedShield />
      </span>
      <span className="flex flex-col leading-none gap-0.75">
        <span className="text-[13px] font-extrabold tracking-[0.02em]">
          MANCHESTER UNITED
        </span>
        <span className="text-[10px] tracking-[0.34em] text-united-red font-bold">
          FC&nbsp;HUB
        </span>
      </span>
    </Link>
  );
}

export { LogoBlock };
