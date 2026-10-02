'use client';

import { Radio, RadioGroup } from '@headlessui/react';

import { HIGHLIGHT_CATEGORIES, type CategoryFilter } from '@pages/highlights/model';
import { cn } from '@shared/utils';

export interface CategoryPillsProps {
  value: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}

/**
 * 카테고리 필터 pills — Headless UI RadioGroup 기반 배타(단일) 선택(AD-4).
 * HIGHLIGHT_CATEGORIES(전체/골/어시스트/세이브/수비/풀매치)를 그대로 렌더한다.
 * 키보드·포커스·ARIA는 RadioGroup이 담당 — 직접 재구현하지 않는다.
 */
function CategoryPills({ value, onChange }: CategoryPillsProps) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      aria-label="카테고리 필터"
      className="flex flex-wrap gap-2"
    >
      {HIGHLIGHT_CATEGORIES.map((category) => (
        <Radio
          key={category}
          value={category}
          className={cn(
            'cursor-pointer rounded-full border border-border bg-background px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors',
            'hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'data-checked:border-transparent data-checked:bg-united-red data-checked:text-white'
          )}
        >
          {category}
        </Radio>
      ))}
    </RadioGroup>
  );
}

export { CategoryPills };
