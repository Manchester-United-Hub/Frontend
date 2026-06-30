// Man United shield mark + wordmark — reproduced from design-ref components.jsx Logo
// SVG kept inline: brand asset (design-source.md — 브랜드 로고 방패 SVG는 인라인 유지)
function FooterLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[34px] h-[34px] flex-none grid place-items-center">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
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
      </span>
      <span className="flex flex-col leading-none gap-[3px]">
        <span className="text-[13px] font-extrabold tracking-[0.02em] text-white">
          MANCHESTER UNITED
        </span>
        <span className="text-[10px] font-bold tracking-[0.34em] text-[var(--united-red)]">
          FC&nbsp;HUB
        </span>
      </span>
    </div>
  );
}

export { FooterLogo };
