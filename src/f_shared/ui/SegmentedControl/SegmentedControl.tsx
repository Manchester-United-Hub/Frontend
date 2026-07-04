'use client';

import { ReactNode } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';

import { cn } from '@shared/utils';

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
  className?: string;
}

/**
 * 배타 선택(단일 선택) 세그먼트 컨트롤 — Headless UI RadioGroup 기반.
 * 트랙: bg-muted 라운드 + 활성 옵션 bg-background/shadow (기존 FormationSegmentedControl·
 * 디자인 .view-toggle과 시각 동등). 키보드·포커스·ARIA는 RadioGroup이 담당.
 */
function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className={cn('inline-flex gap-0.5 rounded-md bg-muted p-[3px]', className)}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          className="flex cursor-pointer items-center gap-1.5 rounded-sm px-3.5 py-[7px] text-[13px] font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-checked:bg-background data-checked:text-foreground data-checked:shadow-xs"
        >
          {option.icon}
          {option.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}

export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedControlOption,
};
