import { Shell } from '@shared/ui';

import type { Stadium } from '../../model/types';
import { PanelHead } from '../PanelHead';
import { StadiumPhotoSlot } from './StadiumPhotoSlot';
import { StadiumMeta } from './StadiumMeta';

const STADIUM_HEADING_ID = 'stadium-heading';

/**
 * StadiumTab — 홈구장 탭. 조립만 담당 — 이름 붙은 서브컴포넌트는 각 파일로 분리
 * (StadiumPhotoSlot/StadiumMeta/StadiumFactItem, 형제 탭 HistoryTab/ManagerTab/SquadTab과
 * 동일 패턴). stadium을 props로 받는 서버 컴포넌트.
 */

export interface StadiumTabProps {
  stadium: Stadium;
}

export function StadiumTab({ stadium }: StadiumTabProps) {
  return (
    <section aria-labelledby={STADIUM_HEADING_ID} className="min-h-[460px] pb-16 pt-10">
      <Shell>
        <PanelHead eyebrow="Home Ground" title="홈구장" headingId={STADIUM_HEADING_ID} />
        <div className="grid grid-cols-[1.3fr_1fr] items-start gap-6 max-[1024px]:grid-cols-1">
          <StadiumPhotoSlot name={stadium.name} />
          <StadiumMeta stadium={stadium} />
        </div>
      </Shell>
    </section>
  );
}
