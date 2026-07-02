import type { ReactNode } from 'react';
import { Building2, History, Ruler, TrendingUp, User } from 'lucide-react';

import { Card } from '@shared/ui';
import type { StadiumFact } from '../../model/types';

// ── 아이콘 매핑 (모듈 스코프 — icon name → lucide ReactNode, 이 컴포넌트 전용) ──

const FACT_ICON_SIZE = 18;

const FACT_ICON_MAP: Record<string, ReactNode> = {
  User: <User size={FACT_ICON_SIZE} aria-hidden="true" />,
  History: <History size={FACT_ICON_SIZE} aria-hidden="true" />,
  Ruler: <Ruler size={FACT_ICON_SIZE} aria-hidden="true" />,
  TrendingUp: <TrendingUp size={FACT_ICON_SIZE} aria-hidden="true" />,
};

/** 매핑에 없는 icon name에 대한 기본 아이콘 — 빈 슬롯 렌더 방지 */
const FALLBACK_FACT_ICON = <Building2 size={FACT_ICON_SIZE} aria-hidden="true" />;

export interface StadiumFactItemProps {
  fact: StadiumFact;
}

/** 팩트 그리드 1항목(아이콘 + 라벨/값 — dt/dd 키·값 쌍). */
export function StadiumFactItem({ fact }: StadiumFactItemProps) {
  return (
    // bg-transparent: 이 소비처만 원래 bg-card 없이 페이지 배경이 비쳐 보이는 시안이라
    // Card 기본 배경을 명시적으로 취소한다(시각 100% 보존, className 호출자 우선).
    <Card padding="none" className="bg-transparent px-4 py-3.5">
      <div className="mb-2 text-muted-foreground">
        {FACT_ICON_MAP[fact.icon] ?? FALLBACK_FACT_ICON}
      </div>
      <dt className="text-xs text-muted-foreground">{fact.label}</dt>
      <dd className="mt-0.5 text-lg font-bold">{fact.value}</dd>
    </Card>
  );
}
