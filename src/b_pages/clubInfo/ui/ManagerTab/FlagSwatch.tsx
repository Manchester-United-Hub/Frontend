/**
 * 국적 국기 그라디언트 — icons.jsx FLAGS 치환. 감독 국적(eng)만 필요, 매핑 없으면 muted 폴백.
 * 시안 원본(icons.jsx)에도 "eng" 매핑이 없어(가장 가까운 "gb"도 실제 유니언잭이 아닌 단색
 * 근사치) 동일한 단순화 관습을 따라 잉글랜드 국기(흰 바탕 + 세인트 조지 크로스)를 세로
 * 줄무늬로 단순화한 값을 새로 추가한다 — 매핑 누락(muted 폴백)이 아니라 의도된 표기다.
 * 국기 색은 도메인 데이터라 디자인 토큰으로 승격하지 않는다 — zoneColor.ts와 동일 판단(decision-1).
 */
const FLAG_GRADIENT: Record<string, string> = {
  eng: 'linear-gradient(90deg,#fff 0 38%,#ce1126 38% 62%,#fff 62% 100%)',
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
