'use client';

import { Users } from 'lucide-react';

import { Badge, Shell } from '@shared/ui';

import { FORMATION_NAMES } from '../../model/formations';
import { lineup, subs } from '../../model/mockData';
import { PanelHead } from '../PanelHead';
import { FormationSegmentedControl } from './FormationSegmentedControl';
import { LineupList } from './LineupList';
import { SquadPitch } from './SquadPitch';
import { useFormation } from './useFormation';

const ICON_USERS = <Users size={13} aria-hidden="true" />;

const PANEL_DESCRIPTION =
  '포메이션을 바꿔 선발 라인업의 배치를 확인하세요. 포지션은 전술에 따라 동적으로 재배치됩니다.';

/**
 * 선수정보(선발 라인업) 탭 — 이 페이지에서 유일하게 클라이언트 상태(선택 포메이션)를 갖는 섹션.
 * 상태는 useFormation에 국소화하고, 피치/라인업은 표현 전용 자식에 props로 흘려보낸다.
 */
const SquadTab = () => {
  const { formation, setFormation, tokens } = useFormation();

  return (
    <Shell className="pb-16 pt-10">
      <PanelHead eyebrow="First Team" title="선수정보" description={PANEL_DESCRIPTION} />

      <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <FormationSegmentedControl
              formations={FORMATION_NAMES}
              active={formation}
              onSelect={setFormation}
            />
            <Badge variant="soft">
              {ICON_USERS}
              선발 XI
            </Badge>
          </div>
          <SquadPitch tokens={tokens} lineup={lineup} />
        </div>
        <LineupList lineup={lineup} subs={subs} formationLabel={formation} />
      </div>
    </Shell>
  );
};

export { SquadTab };
