/** 국적 국기 그라디언트 — icons.jsx FLAGS 치환. 감독 국적(pt)만 필요, 매핑 없으면 muted 폴백. */
const FLAG_GRADIENT: Record<string, string> = {
  pt: 'linear-gradient(90deg,#0a6b3b 0 40%,#d52b1e 40% 100%)',
};

export interface FlagSwatchProps {
  code: string;
}

/** 국기 스와치(장식) — icons.jsx Flag 치환. */
export function FlagSwatch({ code }: FlagSwatchProps) {
  return (
    <span
      aria-hidden="true"
      className="h-[11px] w-4 flex-none rounded-[2px] border border-border/60"
      style={{ background: FLAG_GRADIENT[code] ?? 'var(--muted)' }}
    />
  );
}
