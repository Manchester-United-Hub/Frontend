import { cn } from '@shared/utils';

import type { FormResult } from '../../model';

/**
 * FormPills — 최근 5경기 결과(W/D/L) 미니 배지 5개. design-ref `.fp`(19x19,
 * radius5, 10px bold 흰글자)를 재현한다. `@shared/ui` `ResultBadge`(24px 원형,
 * 단일 결과 전용)와 색 토큰(bg-win/draw/loss)은 동일하게 재사용하지만, 크기(19px)·
 * 형태(radius5 사각)·다중 나열(5개) 요구가 ResultBadge의 고정 스펙(h-6 w-6
 * rounded-full, 단일 값)과 달라 그대로 소비할 수 없다 — variant로도 흡수 불가해
 * 페이지 전용으로 새로 작성했다(implementation.md §1.5, result-ST-02.md 기록).
 */

const FORM_COLOR: Record<FormResult, string> = {
  W: 'bg-win',
  D: 'bg-draw',
  L: 'bg-loss',
};

const FORM_LABEL: Record<FormResult, string> = {
  W: '승',
  D: '무',
  L: '패',
};

export interface FormPillsProps {
  /** 최근 5경기 결과, 오래된 순. */
  form: FormResult[];
  className?: string;
}

export function FormPills({ form, className }: FormPillsProps) {
  return (
    <ul role="list" aria-label="최근 5경기 결과" className={cn('flex items-center gap-1', className)}>
      {form.map((result, index) => (
        <li key={`${result}-${index}`}>
          <span
            role="img"
            aria-label={FORM_LABEL[result]}
            className={cn(
              'grid h-[19px] w-[19px] place-items-center rounded-[5px] text-[10px] font-bold text-white',
              FORM_COLOR[result]
            )}
          >
            {result}
          </span>
        </li>
      ))}
    </ul>
  );
}
