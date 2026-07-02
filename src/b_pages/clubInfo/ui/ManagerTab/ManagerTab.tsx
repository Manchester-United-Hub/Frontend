import { Target } from 'lucide-react';

import { Badge, Shell } from '@shared/ui';

import type { Manager, ManagerRecord } from '../../model/types';
import { PanelHead } from '../PanelHead';
import { ManagerCard } from './ManagerCard';
import { InfoCell, type InfoCellData } from './InfoCell';
import { RecordCell, type RecordCellData } from './RecordCell';

/**
 * ManagerTab — 감독 카드(실루엣+메타) + 정보 그리드 + 전술 스타일 칩 + 성적 요약(P/W/D/L+승률).
 * manager를 props로 받는 서버 컴포넌트. 조립만 담당 — 이름 붙은 서브컴포넌트는 각 파일로 분리
 * (ManagerCard/InfoCell/RecordCell/Silhouette/FlagSwatch, 형제 탭 HistoryTab/SquadTab과 동일 패턴).
 * 승률은 useEffect 없이 렌더 중 파생 계산(code-conventions §1).
 */

/** 승률(%) = round(w / p * WIN_RATE_SCALE) — 매직 넘버 100 상수화 */
const WIN_RATE_SCALE = 100;
/** p===0(0경기)일 때 승률 계산이 NaN이 되는 것을 막는 대체 표기 */
const WIN_RATE_UNAVAILABLE = '—';

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

/**
 * 승률(%) 표시 문자열 — 렌더 중 순수 파생 계산(useEffect 미사용).
 * p===0(0경기 재임)이면 0으로 나누어 NaN%가 되므로 대체 표기(WIN_RATE_UNAVAILABLE)로 가드한다.
 */
function formatWinRate(record: ManagerRecord): string {
  if (record.p === 0) return WIN_RATE_UNAVAILABLE;
  return `${Math.round((record.w / record.p) * WIN_RATE_SCALE)}%`;
}

/** 부임/계약/선호 포메이션/직전 경력 — 정보 그리드 4셀. model.manager를 dl 항목으로 변환. */
function buildInfoCells(manager: Manager): InfoCellData[] {
  return [
    { k: '부임', v: manager.appointed },
    { k: '계약 기간', v: manager.contract },
    { k: '선호 포메이션', v: manager.preferred },
    { k: '직전 경력', v: manager.prevClubs.join(' · '), small: true },
  ];
}

/** 경기/승/무/패 — 성적 요약 4셀. */
function buildRecordCells(record: ManagerRecord): RecordCellData[] {
  return [
    { k: '경기 P', n: record.p },
    { k: '승 W', n: record.w, variant: 'win' },
    { k: '무 D', n: record.d },
    { k: '패 L', n: record.l, variant: 'loss' },
  ];
}
