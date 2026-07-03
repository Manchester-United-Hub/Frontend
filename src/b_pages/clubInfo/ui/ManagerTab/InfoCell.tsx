import { BilingualLabel } from '@shared/ui';
import { cn } from '@shared/utils';

export interface InfoCellData {
  k: string;
  v: string;
  /** 직전 경력 셀만 시안에서 값 폰트를 14px로 축소 표기 */
  small?: boolean;
}

export interface InfoCellProps extends InfoCellData {
  /** 좌측 열(1·3번째 셀)에 우측 보더를 붙인다 — mgr-info 2열 그리드 구분선 */
  rightBorder: boolean;
}

/** 정보 그리드 1셀(부임/계약/포메이션/경력 — dt/dd 키·값 쌍). */
export function InfoCell({ k, v, small, rightBorder }: InfoCellProps) {
  return (
    <div className={cn('border-b border-border px-[18px] py-4', rightBorder && 'border-r')}>
      {/* en 없이 kr만 전달 — BilingualLabel이 kr에 size=sm 마이크로 라벨 타이포를 적용한다. */}
      <dt>
        <BilingualLabel kr={k} size="sm" />
      </dt>
      <dd className={cn('m-0 mt-1 font-bold', small ? 'text-sm' : 'text-base')}>{v}</dd>
    </div>
  );
}
