import Link from 'next/link';

const logoShield = (
  <svg
    width="34"
    height="34"
    viewBox="0 0 34 34"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M17 2.5 30 7v8.5c0 8.4-5.7 13.4-13 16.5C9.7 28.9 4 23.9 4 15.5V7z"
      fill="var(--united-red)"
    />
    <path
      d="M17 9.5v15M11 13.5v8M23 13.5v8"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

// ── 서브컴포넌트 (모듈 스코프 — 컴포넌트 내부 정의 금지) ──────────────────

function LogoBlock() {
  return (
    <Link
      href="/"
      aria-label="맨체스터 유나이티드 FC HUB 홈으로"
      className="flex items-center gap-2.5 shrink-0"
    >
      <span className="w-8.5 h-8.5 flex-none grid place-items-center">
        {logoShield}
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
