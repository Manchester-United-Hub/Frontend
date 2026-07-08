import { BilingualLabel, Shell } from '@shared/ui';
import { cn } from '@shared/utils';

import type { SubTabId, SubTabMeta } from '../../model';

interface SubTabProps {
  tab: SubTabMeta;
  isActive: boolean;
  onChange: (id: SubTabId) => void;
}

/** 탭 버튼 1개. 모듈 스코프 정의(SubTabNav 내부 정의 금지 — code-conventions §1). */
function SubTab({ tab, isActive, onChange }: SubTabProps) {
  const handleClick = () => onChange(tab.id);

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${tab.id}`}
      aria-selected={isActive}
      aria-controls={`panel-${tab.id}`}
      onClick={handleClick}
      className={cn(
        'relative flex flex-none flex-col items-center gap-px whitespace-nowrap border-0 bg-transparent px-4 pb-3.25 pt-3.5 text-[15px] font-medium text-muted-foreground transition-colors',
        'hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'max-[820px]:px-3 max-[820px]:pb-3 max-[820px]:pt-3.25 max-[820px]:text-sm',
        isActive &&
          "text-united-red after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-sm after:bg-united-red after:content-['']"
      )}
    >
      <BilingualLabel kr={tab.kr} en={tab.en} className="gap-px" enClassName="opacity-80" />
    </button>
  );
}

/**
 * SubTabNav — 시즌 페이지 서브탭 네비게이션(일정 & 결과 / 순위표, 2탭). 표현 전용
 * (상태 미소유). 활성 탭 상태는 부모 SeasonTabs('use client')가 소유하고
 * activeId/onChange로 주입한다. clubInfo `ui/SubTabNav`를 그대로 미러링했다
 * (soon 배지만 없음 — season SubTabMeta에 `soon` 필드가 없다, ST-01 계약).
 * `id="tab-{id}"` / `aria-controls="panel-{id}"` 규약으로 tabpanel과 연결된다.
 */

export interface SubTabNavProps {
  /** 렌더할 탭 목록(2: fixtures/table). model.subTabs를 그대로 전달. */
  tabs: SubTabMeta[];
  /** 현재 활성 탭 id. */
  activeId: SubTabId;
  /** 탭 클릭 시 호출 — 상태 갱신은 호출자(SeasonTabs) 책임. */
  onChange: (id: SubTabId) => void;
}

export function SubTabNav({ tabs, activeId, onChange }: SubTabNavProps) {
  return (
    <div className="sticky top-16 z-30 mt-6 border-b border-border bg-background/90 backdrop-blur-[10px] backdrop-saturate-[1.4] max-[620px]:top-14">
      <Shell>
        <div
          role="tablist"
          aria-label="시즌 하위 탭"
          className="flex items-stretch gap-10 overflow-x-auto overflow-y-hidden touch-pan-x overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden *:first:ml-auto *:last:mr-auto max-[820px]:gap-1.5"
        >
          {tabs.map((tab) => (
            <SubTab key={tab.id} tab={tab} isActive={tab.id === activeId} onChange={onChange} />
          ))}
        </div>
      </Shell>
    </div>
  );
}
