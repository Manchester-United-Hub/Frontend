import type { ChangeEvent } from 'react';
import { Search, X } from 'lucide-react';

import { cn } from '@shared/utils';

interface RosterSearchFieldProps {
  value: string;
  onChange: (query: string) => void;
  className?: string;
}

/**
 * 선수 검색 입력 (ADR-1) — 콤보박스형 SearchInput을 재사용하지 않고 페이지 전용 native
 * input으로 구현한다. 타이핑 즉시 그리드를 필터링하는 자유 텍스트 검색이라 후보 선택형
 * Combobox 계약과 맞지 않고, plain input은 키보드·포커스·ARIA 재구현이 없어 Headless UI
 * 기본 원칙에 저촉되지 않는다.
 */
function RosterSearchField({ value, onChange, className }: RosterSearchFieldProps) {
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  function handleClear() {
    onChange('');
  }

  return (
    <div className={cn('min-w-[200px]', className)}>
      <span className="mb-[5px] block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
        검색
      </span>
      <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
        <Search size={16} aria-hidden="true" className="shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={handleInputChange}
          placeholder="선수 이름 (한글·영문)"
          aria-label="선수 검색"
          className="min-w-0 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        {value ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="검색어 지우기"
            className="inline-flex shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export { RosterSearchField, type RosterSearchFieldProps };
