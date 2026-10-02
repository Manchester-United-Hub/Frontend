import { Badge, Shell } from '@shared/ui';

import type { Manager } from '../../model/types';
import { ManagerFacts } from './ManagerFacts';
import { ManagerCareer } from './ManagerCareer';
import { Silhouette } from './Silhouette';

/**
 * ManagerTab — mgr-detail 2열 그리드(좌: 이름·직함 + 정보 5행 / 우: 사진 슬롯 + 경력선).
 * manager를 props로 받는 서버 컴포넌트. 조립만 담당 — 이름 붙은 서브컴포넌트는 각 파일로 분리
 * (ManagerFacts/ManagerCareer/Silhouette/FlagSwatch).
 */

export interface ManagerTabProps {
  manager: Manager;
}

export function ManagerTab({ manager }: ManagerTabProps) {
  return (
    <Shell className="pb-16 pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <div>
          <div>
            <Badge variant="position">{manager.role}</Badge>
            <h2 className="mt-2.5 text-[30px] font-extrabold tracking-[-0.02em]">{manager.name}</h2>
            <div className="mt-[3px] text-sm text-muted-foreground">{manager.en}</div>
          </div>
          <ManagerFacts manager={manager} />
        </div>

        <div>
          <div className="grid aspect-square w-40 place-items-center overflow-hidden rounded-lg border border-border bg-[repeating-linear-gradient(135deg,var(--muted)_0_8px,var(--background)_8px_16px)]">
            <Silhouette />
          </div>
          <ManagerCareer manager={manager} />
        </div>
      </div>
    </Shell>
  );
}
