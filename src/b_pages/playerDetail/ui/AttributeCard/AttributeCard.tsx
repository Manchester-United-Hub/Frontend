import { Card } from '@shared/ui';

import type { RadarPoint } from '../../model/types';
import { HexRadar } from '../charts/HexRadar';
import { AttributeBarList } from './AttributeBarList';

/**
 * 능력치 카드 (`.attr-card`) — Card 셸(border/bg-card/rounded-lg) 재사용 +
 * 시안 전용 padding(20px 22px)은 className으로 흡수(implementation §1.5).
 * OVR 배지(`.ovr-badge`)는 큰 숫자+캡션 2단 레이아웃이라 f_shared Badge의
 * 표준 pill 형태와 맞지 않아 신규 마크업으로 둔다.
 */
export interface AttributeCardProps {
  radar: RadarPoint[];
  ovr: number;
}

export function AttributeCard({ radar, ovr }: AttributeCardProps) {
  return (
    <Card padding="none" className="mt-[22px] p-5 md:p-[22px]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-[15px] font-bold">
          선수 능력치 <span className="font-medium text-muted-foreground">· Attributes</span>
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <b className="text-2xl font-extrabold tracking-[-0.02em] text-united-red">{ovr}</b>
          <small className="text-[11px] font-semibold tracking-[0.1em] text-muted-foreground">OVR</small>
        </span>
      </div>
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[300px_1fr]">
        <div className="grid place-items-center">
          <HexRadar data={radar} />
        </div>
        <AttributeBarList radar={radar} />
      </div>
    </Card>
  );
}
