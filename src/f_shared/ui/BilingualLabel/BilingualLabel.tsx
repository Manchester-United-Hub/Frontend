import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@shared/utils';

/**
 * kr(국문) + en(영문, 작은 uppercase 트래킹 서브라벨) 병기 라벨.
 * 세로 스택(kr 위 · en 아래)이 기본형이며 `align`으로 정렬축만 제어한다.
 * `en`을 생략하면 kr 자체가 en과 동일한 마이크로 라벨 타이포를 취한다 —
 * "값 없는 라벨 하나만" 필요한 소비처(예: ManagerTab/InfoCell dt)용.
 * 나머지 배치(가로 배열 등)는 `className`/`krClassName`/`enClassName`(호출자 우선)으로 흡수한다.
 */

const wrapperVariants = cva('inline-flex flex-col', {
  variants: {
    align: {
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: {
    align: 'center',
  },
});

const enVariants = cva('text-muted-foreground uppercase', {
  variants: {
    size: {
      xs: 'text-[9px] tracking-[0.1em]',
      sm: 'text-[11px] font-semibold tracking-[0.08em]',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

interface BilingualLabelProps extends VariantProps<typeof wrapperVariants> {
  /** 국문 라벨(주 텍스트). */
  kr: ReactNode;
  /** 영문 서브라벨. 생략하면 kr이 en과 동일한 마이크로 타이포(size)를 취한다. */
  en?: ReactNode;
  /** en(또는 en 생략 시 kr) 서브라벨 크기 프리셋. */
  size?: VariantProps<typeof enVariants>['size'];
  className?: string;
  krClassName?: string;
  enClassName?: string;
}

const BilingualLabel = ({
  kr,
  en,
  align,
  size,
  className,
  krClassName,
  enClassName,
}: BilingualLabelProps) => {
  const krClass = en ? krClassName : cn(enVariants({ size }), krClassName);

  return (
    <span className={cn(wrapperVariants({ align }), className)}>
      <span className={krClass}>{kr}</span>
      {en ? <span className={cn(enVariants({ size }), enClassName)}>{en}</span> : null}
    </span>
  );
};

export { BilingualLabel, type BilingualLabelProps };
