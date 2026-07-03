/** 감독 실루엣 아이콘(장식) — 사진 미제공 상태의 플레이스홀더. */
export function Silhouette() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-[52%] w-[52%] text-[color-mix(in_srgb,var(--muted-foreground)_38%,transparent)]"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.6-9 6v2h18v-2c0-3.4-4-6-9-6Z" />
    </svg>
  );
}
