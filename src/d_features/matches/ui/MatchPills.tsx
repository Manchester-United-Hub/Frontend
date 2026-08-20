import { cn } from '@shared/utils';

/**
 * FilterPills — 일정 탭의 홈/원정·대회 필터 버튼 그룹. `@shared/ui`
 * `SegmentedControl`(Headless UI RadioGroup, `data-checked` 기반)과 시각은
 * 유사하지만, 서브태스크 명세가 "필터 pill: 버튼 aria-pressed"를 명시적으로
 * 요구한다 — RadioGroup의 role="radiogroup"/`aria-checked` 시맨틱과는 다른
 * toggle-button 패턴이라 SegmentedControl로 흡수할 수 없다(implementation.md
 * §1.5, 신규 작성 사유 — result-ST-02.md에도 기록).
 */

interface FilterPillOption<T extends string> {
  value: T;
  label: string;
}

function FilterPillButton<T extends string>({
  option,
  isActive,
  onChange,
}: FilterPillButtonProps<T>) {
  const handleClick = () => onChange(option.value);

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={handleClick}
      className={cn(
        'h-8 rounded-full border px-3.5 text-[13px] font-medium transition-colors',
        isActive
          ? 'border-transparent bg-united-red text-white'
          : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      {option.label}
    </button>
  );
}

interface FilterPillButtonProps<T extends string> {
  option: FilterPillOption<T>;
  isActive: boolean;
  onChange: (value: T) => void;
}

export interface FilterPillsProps<T extends string> {
  /** 필터 그룹 라벨(예: "홈/원정"). */
  label: string;
  options: readonly FilterPillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: FilterPillsProps<T>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <FilterPillButton
            key={option.value}
            option={option}
            isActive={option.value === value}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
