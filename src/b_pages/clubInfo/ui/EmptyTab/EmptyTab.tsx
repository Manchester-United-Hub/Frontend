import type { ReactNode } from 'react';
import { BarChart3, LayoutGrid } from 'lucide-react';

import { Shell, StateBox } from '@shared/ui';
import type { EmptyTabCopy } from '../../model/types';

/**
 * EmptyTab — "준비 중" 서브탭(팀통계) 빈 상태. design-ref club.jsx의
 * `EmptyTab` 마크업(.empty-tab)을 f_shared `StateBox` 재사용으로 치환했다
 * (신규 빈상태 컴포넌트 작성 금지 — implementation.md §1.5).
 */

// ── 아이콘 매핑 (모듈 스코프 — model.emptyTabCopy.icon → lucide ReactNode) ──

const EMPTY_ICON_SIZE = 22;

const EMPTY_ICON_MAP: Record<string, ReactNode> = {
  BarChart3: <BarChart3 size={EMPTY_ICON_SIZE} aria-hidden="true" />,
};

/** 매핑에 없는 icon name에 대한 기본 아이콘 — 빈 슬롯 렌더 방지 */
const FALLBACK_EMPTY_ICON = <LayoutGrid size={EMPTY_ICON_SIZE} aria-hidden="true" />;

export interface EmptyTabProps {
  /** 탭 국문 라벨(예: "팀통계") — "{label} 준비 중이에요" 타이틀에 쓰인다. */
  label: string;
  /** model.emptyTabCopy[tabId]. */
  copy: EmptyTabCopy;
}

export function EmptyTab({ label, copy }: EmptyTabProps) {
  return (
    <Shell className="pb-16 pt-10">
      <StateBox
        className="min-h-[460px]"
        headingLevel={3}
        icon={EMPTY_ICON_MAP[copy.icon] ?? FALLBACK_EMPTY_ICON}
        title={`${label} 준비 중이에요`}
        description={copy.desc}
      />
    </Shell>
  );
}
