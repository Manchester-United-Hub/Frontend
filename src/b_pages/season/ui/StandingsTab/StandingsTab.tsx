import { Shell } from '@shared/ui';

import { standings } from '../../model';
import { PanelHead } from '../PanelHead';
import { StandingsTable } from './StandingsTable';
import { ZoneLegend } from './ZoneLegend';

const PANEL_DESCRIPTION = '2025/26 시즌 프리미어리그 20개 클럽의 순위와 최근 5경기 폼을 확인하세요.';

/** StandingsTab — 순위표 탭. 정적 mock 데이터만 소비하는 서버 컴포넌트(상태 없음). */
export function StandingsTab() {
  return (
    <Shell className="pb-16 pt-10">
      <PanelHead eyebrow="League Table" title="순위표" description={PANEL_DESCRIPTION} />
      <StandingsTable standings={standings} />
      <div className="mt-5">
        <ZoneLegend />
      </div>
    </Shell>
  );
}
