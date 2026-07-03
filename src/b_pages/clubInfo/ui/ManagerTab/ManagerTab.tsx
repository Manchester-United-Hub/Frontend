import { Target } from 'lucide-react';

import { Badge, Shell } from '@shared/ui';

import type { Manager } from '../../model/types';
import { PanelHead } from '../PanelHead';
import { ManagerCard } from './ManagerCard';
import { InfoCell } from './InfoCell';
import { RecordCell } from './RecordCell';
import { formatWinRate, buildInfoCells, buildRecordCells } from './utils';

/**
 * ManagerTab — 감독 카드(실루엣+메타) + 정보 그리드 + 전술 스타일 칩 + 성적 요약(P/W/D/L+승률).
 * manager를 props로 받는 서버 컴포넌트. 조립만 담당 — 이름 붙은 서브컴포넌트는 각 파일로 분리
 * (ManagerCard/InfoCell/RecordCell/Silhouette/FlagSwatch, 형제 탭 HistoryTab/SquadTab과 동일 패턴).
 * 승률은 useEffect 없이 렌더 중 파생 계산(code-conventions §1).
 * 파생 유틸(formatWinRate/buildInfoCells/buildRecordCells)은 ./utils로 분리.
 */

export interface ManagerTabProps {
  manager: Manager;
}

export function ManagerTab({ manager }: ManagerTabProps) {
  const winRateLabel = formatWinRate(manager.record);
  const infoCells = buildInfoCells(manager);
  const recordCells = buildRecordCells(manager.record);

  return (
    <Shell className="min-h-[460px] pb-16 pt-10">
      <PanelHead eyebrow="Head Coach" title="감독" />

      <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <ManagerCard manager={manager} />

        <div>
          <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-border">
            {infoCells.map((cell, i) => (
              <InfoCell key={cell.k} {...cell} rightBorder={i % 2 === 0} />
            ))}
          </dl>

          <section className="mt-5" aria-label="전술 스타일">
            <h3 className="mb-3 text-[15px] font-bold">전술 스타일 · Style of Play</h3>
            <ul role="list" className="flex flex-wrap gap-2">
              {manager.style.map((s) => (
                <li key={s}>
                  <Badge>
                    <Target size={13} aria-hidden />
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-5" aria-label="성적 요약">
            <h3 className="mb-3 text-[15px] font-bold">성적 요약 · Record (재임 중)</h3>
            <ul role="list" className="grid grid-cols-2 gap-3 min-[620px]:grid-cols-4">
              {recordCells.map((cell) => (
                <li key={cell.k}>
                  <RecordCell {...cell} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              승률 <strong className="text-base text-foreground">{winRateLabel}</strong> ·{' '}
              {manager.record.p}경기 기준
            </p>
          </section>
        </div>
      </div>
    </Shell>
  );
}
