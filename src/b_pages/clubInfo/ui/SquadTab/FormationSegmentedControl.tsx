import { SegmentedControl, type SegmentedControlOption } from '@shared/ui';

import type { FormationName } from '../../model/types';

interface FormationSegmentedControlProps {
  formations: readonly FormationName[];
  active: FormationName;
  onSelect: (next: FormationName) => void;
}

/**
 * 포메이션 세그먼트 토글 — 공통 SegmentedControl(ADR-9) 소비 어댑터.
 * formations 배열을 SegmentedControl 옵션으로 매핑하는 것만 담당한다(트랙 마크업은 SegmentedControl 소유).
 */
const FormationSegmentedControl = ({
  formations,
  active,
  onSelect,
}: FormationSegmentedControlProps) => {
  const options: SegmentedControlOption<FormationName>[] = formations.map(
    (name) => ({ value: name, label: name }),
  );

  return (
    <SegmentedControl
      options={options}
      value={active}
      onChange={onSelect}
      aria-label="포메이션 선택"
    />
  );
};

export { FormationSegmentedControl, type FormationSegmentedControlProps };
