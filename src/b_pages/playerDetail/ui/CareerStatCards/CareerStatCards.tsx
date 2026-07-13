import { Hash, Target, Footprints, Trophy, type LucideIcon } from 'lucide-react';

import { Card } from '@shared/ui';

import type { CareerTotals } from '../../model/types';

/**
 * 통산 스탯 카드 4개 (.rec-cards). f_shared Card 셸을 재사용하고, 아이콘·수치·
 * 라벨만 카드별로 다르다 — 시안(RecordTab의 `stats` 배열)과 동일하게 모듈 스코프
 * 설정 배열을 매핑해 렌더한다(카드마다 별도 이름 붙은 컴포넌트로 분리할 실익 없음:
 * 재사용처가 이 목록 하나뿐이고, 로직 없는 정적 마크업 반복 — code-conventions §6
 * "순수 1회성 정적 조각은 코로케이션 허용" 해당).
 */
export interface CareerStatCardsProps {
  career: CareerTotals;
  trophies: number;
}

interface StatDef {
  icon: LucideIcon;
  value: number;
  label: string;
}

const ICON_SIZE = 20;

export function CareerStatCards({ career, trophies }: CareerStatCardsProps) {
  const stats: StatDef[] = [
    { icon: Hash, value: career.apps, label: '출전 경기' },
    { icon: Target, value: career.goals, label: '득점' },
    { icon: Footprints, value: career.assists, label: '도움' },
    { icon: Trophy, value: trophies, label: '우승 트로피' },
  ];

  return (
    <ul
      role="list"
      aria-label="통산 기록"
      className="grid grid-cols-2 gap-3.5 sm:grid-cols-4"
    >
      {stats.map(({ icon: Icon, value, label }) => (
        <li key={label}>
          <Card padding="md" className="relative overflow-hidden">
            <Icon size={ICON_SIZE} className="text-muted-foreground" aria-hidden="true" />
            <div className="mt-2.5 text-[32px] font-extrabold leading-none tracking-[-0.02em] text-foreground">
              {value}
            </div>
            <div className="mt-0.5 text-[13px] text-muted-foreground">{label}</div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
