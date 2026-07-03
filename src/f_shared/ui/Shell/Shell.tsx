import { ReactNode } from 'react';

import { cn } from '@shared/utils';

/**
 * 페이지 콘텐츠 셸 컨테이너 — `mx-auto max-w-[1200px] px-6` 반복 인라인을 대체한다.
 * max-width는 매직값 대신 `--container-shell` 토큰(app/globals.css)을 통해
 * `max-w-shell` 유틸리티로 적용된다. 추가 여백·레이아웃은 `className`(호출자 우선)으로 흡수한다.
 */

export interface ShellProps {
  children: ReactNode;
  className?: string;
}

const Shell = ({ children, className }: ShellProps) => (
  <div className={cn('mx-auto max-w-shell px-6', className)}>{children}</div>
);

export { Shell };
