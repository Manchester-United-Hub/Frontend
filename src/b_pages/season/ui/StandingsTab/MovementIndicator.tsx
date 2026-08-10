import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

import { cn } from '@shared/utils';
import { StandingMovement } from '@entities/rank/model';

interface MovementConfig {
  icon: ReactNode;
  colorClassName: string;
  label: string;
}

// 아이콘은 movement 값에만 의존(props 무관) — 모듈 스코프 1회 생성(code-conventions §2).
const MOVEMENT_CONFIG: Record<StandingMovement, MovementConfig> = {
  up: {
    icon: <ArrowUp size={14} aria-hidden="true" />,
    colorClassName: 'text-win',
    label: '순위 상승',
  },
  down: {
    icon: <ArrowDown size={14} aria-hidden="true" />,
    colorClassName: 'text-united-red',
    label: '순위 하락',
  },
  same: {
    icon: <Minus size={14} aria-hidden="true" />,
    colorClassName: 'text-muted-foreground',
    label: '순위 변동 없음',
  },
};

export interface MovementIndicatorProps {
  movement: StandingMovement;
  className?: string;
}

/** MovementIndicator — col-mv(30px) 순위 변동 삼각 화살표. design-ref: up=win색·down=united-red색·same=muted. */
export function MovementIndicator({
  movement,
  className,
}: MovementIndicatorProps) {
  const config = MOVEMENT_CONFIG[movement];

  return (
    <span
      role="img"
      aria-label={config.label}
      className={cn(
        'grid h-7.5 w-7.5 place-items-center',
        config.colorClassName,
        className
      )}
    >
      {config.icon}
    </span>
  );
}
