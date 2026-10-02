'use client';

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@shared/utils';

interface FilterSelectOption {
  key: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (key: string) => void;
  className?: string;
  'aria-label'?: string;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
  'aria-label': ariaLabel,
}: FilterSelectProps) {
  const selected = options.find((option) => option.key === value);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={cn('relative', className)}>
        <span className="mb-[5px] block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          {label}
        </span>
        <ListboxButton
          aria-label={ariaLabel ?? label}
          className="flex h-10 min-w-[132px] items-center whitespace-nowrap rounded-md border border-input bg-background pl-3.5 pr-8 text-sm font-medium text-foreground transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {selected?.label ?? ''}
          <ChevronDown
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom start"
          className="z-50 mt-1 w-[var(--button-width)] overflow-auto rounded-md border border-border bg-card p-1 shadow-md [--anchor-gap:4px]"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.key}
              value={option.key}
              className="cursor-pointer rounded-sm px-3 py-2 text-sm text-foreground select-none data-focus:bg-accent"
            >
              {option.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}

export { FilterSelect, type FilterSelectProps, type FilterSelectOption };
