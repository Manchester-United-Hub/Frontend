interface UnitedShieldProps {
  /** 한 변 길이(px). 기본 34. */
  size?: number;
  className?: string;
}

/**
 * 맨체스터 유나이티드 방패 브랜드 마크.
 * Navbar(LogoBlock)·Footer(FooterLogo) 등에서 공용으로 소비한다 — 중복 SVG 통합.
 * 장식 요소이므로 `aria-hidden` 고정.
 */
function UnitedShield({ size = 34, className }: UnitedShieldProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
      className={className}
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
}

export { UnitedShield, type UnitedShieldProps };
