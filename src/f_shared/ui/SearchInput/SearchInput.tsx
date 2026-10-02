'use client';

import { ReactNode } from 'react';
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Search } from 'lucide-react';

import { cn } from '@shared/utils';

interface SearchInputProps<T> {
  /** 표시할 후보 목록. 필터링은 소비자 책임(query 기반). */
  items: T[];
  /** 선택된 값(제어형). */
  value: T | null;
  /** 후보 선택 시 호출. */
  onChange: (value: T | null) => void;
  /** 입력 변경 시 호출 — 소비자가 이 값으로 items를 필터링한다. 입력 텍스트 자체는 컴포넌트(Headless UI)가 관리한다. */
  onQueryChange: (query: string) => void;
  /** 후보의 고유 key. */
  getKey: (item: T) => string | number;
  /** 후보의 표시 라벨(입력창 displayValue·기본 옵션 렌더에 사용). */
  getLabel: (item: T) => string;
  /** 옵션 커스텀 렌더(미지정 시 getLabel). */
  renderOption?: (item: T) => ReactNode;
  placeholder?: string;
  /** 키보드 단축키 힌트(kbd). 예: "/". */
  shortcut?: string;
  /** 후보가 없을 때 메시지. */
  emptyMessage?: string;
  containerClassName?: string;
  className?: string;
  'aria-label'?: string;
}

function SearchInput<T>({
  items,
  value,
  onChange,
  onQueryChange,
  getKey,
  getLabel,
  renderOption,
  placeholder,
  shortcut,
  emptyMessage = '검색 결과가 없어요',
  containerClassName,
  className,
  'aria-label': ariaLabel = '검색',
}: SearchInputProps<T>) {
  return (
    <Combobox
      value={value}
      onChange={onChange}
      by={(a, b) =>
        a == null || b == null ? a === b : getKey(a) === getKey(b)
      }
      immediate
    >
      <div className="relative">
        <div
          className={cn(
            'flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-muted-foreground transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
            containerClassName
          )}
        >
          <Search size={16} className="shrink-0" aria-hidden />
          <ComboboxInput
            aria-label={ariaLabel}
            placeholder={placeholder}
            displayValue={(item: T | null) => (item ? getLabel(item) : '')}
            onChange={(event) => onQueryChange(event.target.value)}
            className={cn(
              'min-w-0 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
              className
            )}
          />
          {shortcut ? (
            <kbd className="rounded border border-border bg-muted px-[5px] py-px font-mono text-[11px] text-muted-foreground">
              {shortcut}
            </kbd>
          ) : null}
        </div>
        <ComboboxOptions className="absolute top-full right-0 left-0 z-50 mt-1 max-h-72 overflow-auto rounded-md border border-border bg-card p-1 shadow-md">
          {items.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            items.map((item) => (
              <ComboboxOption
                key={getKey(item)}
                value={item}
                className="cursor-pointer rounded-sm px-3 py-2 text-sm text-foreground select-none data-focus:bg-accent"
              >
                {renderOption ? renderOption(item) : getLabel(item)}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}

export { SearchInput, type SearchInputProps };
