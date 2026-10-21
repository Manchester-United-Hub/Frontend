import { UserX } from 'lucide-react';

import { Badge, Shell, StateBox } from '@shared/ui';

import type { Manager } from '../../model/types';
import { ManagerFacts } from './ManagerFacts';
import { ManagerCareer } from './ManagerCareer';
import { ManagerPhoto } from './ManagerPhoto';

const UNAVAILABLE_ICON_SIZE = 22;

/**
 * ManagerTab — mgr-detail 2열 그리드(좌: 이름·직함 + 정보 5행 / 우: 사진 슬롯 + 경력선).
 * 조립만 담당 — 이름 붙은 서브컴포넌트는 각 파일로 분리(ManagerFacts/ManagerCareer/ManagerPhoto).
 * manager가 null(감독 API 실패)이면 StateBox 빈 상태를 렌더한다.
 */

export interface ManagerTabProps {
  manager: Manager | null;
}

export function ManagerTab({ manager }: ManagerTabProps) {
  if (!manager) {
    return (
      <Shell className="pb-16 pt-10">
        <StateBox
          className="min-h-[460px]"
          headingLevel={3}
          icon={<UserX size={UNAVAILABLE_ICON_SIZE} aria-hidden="true" />}
          title="감독 정보를 불러오지 못했어요"
          description="잠시 후 다시 시도해 주세요."
        />
      </Shell>
    );
  }

  return (
    <Shell className="pb-16 pt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
        <div>
          <div>
            <Badge variant="position">{manager.role}</Badge>
            <h2 className="mt-2.5 text-[30px] font-extrabold tracking-[-0.02em]">{manager.name}</h2>
          </div>
          <ManagerFacts manager={manager} />
        </div>

        <div>
          <div className="grid aspect-square w-40 place-items-center overflow-hidden rounded-lg border border-border bg-[repeating-linear-gradient(135deg,var(--muted)_0_8px,var(--background)_8px_16px)]">
            <ManagerPhoto src={manager.photo} alt={`${manager.name} 감독 사진`} />
          </div>
          <ManagerCareer manager={manager} />
        </div>
      </div>
    </Shell>
  );
}
