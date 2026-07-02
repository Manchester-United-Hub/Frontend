import { cn } from '@shared/utils';

import type { FormationName } from '../../model/types';

interface FormationSegmentedControlProps {
  formations: readonly FormationName[];
  active: FormationName;
  onSelect: (next: FormationName) => void;
}

/** 포메이션 4종 세그먼트 토글. 선택 상태는 aria-pressed로 노출. */
const FormationSegmentedControl = ({
  formations,
  active,
  onSelect,
}: FormationSegmentedControlProps) => (
  <div
    role="group"
    aria-label="포메이션 선택"
    className="inline-flex gap-0.5 rounded-md bg-muted p-[3px]"
  >
    {formations.map((name) => {
      const handleSelect = () => onSelect(name);

      return (
        <button
          key={name}
          type="button"
          aria-pressed={active === name}
          onClick={handleSelect}
          className={cn(
            'rounded-sm px-3.5 py-[7px] text-[13px] font-medium text-muted-foreground transition-colors',
            active === name && 'bg-background text-foreground shadow-xs',
          )}
        >
          {name}
        </button>
      );
    })}
  </div>
);

export { FormationSegmentedControl, type FormationSegmentedControlProps };
