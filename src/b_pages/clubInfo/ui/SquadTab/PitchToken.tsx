import { cn } from '@shared/utils';

const TOKEN_TRANSITION =
  'transition-[left,top] duration-[450ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none';

interface PitchTokenProps {
  /** 좌 0 → 우 100 (%). */
  x: number;
  /** 공격진영 0 → GK(자책골) 100 (%). */
  y: number;
  num: number;
  name: string;
  isGoalkeeper: boolean;
}

/**
 * 피치 위 선수 1명 — 등번호 디스크 + 이름 태그. 좌표만 소비하는 표현 전용 컴포넌트.
 * BilingualLabel 미적용(설계 판단, review-reuse-audit.md B2): name은 국문 단일 라벨이고
 * en 서브라벨 데이터 자체가 없어 kr+en 병기 패턴에 해당하지 않는다.
 */
const PitchToken = ({ x, y, num, name, isGoalkeeper }: PitchTokenProps) => (
  <div
    className={cn(
      'absolute flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[3px]',
      TOKEN_TRANSITION,
    )}
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <span
      className={cn(
        'grid h-[38px] w-[38px] place-items-center rounded-full border-2 border-white/85 text-[15px] font-extrabold shadow-[0_2px_6px_rgba(0,0,0,0.35)]',
        isGoalkeeper ? 'bg-[#f4c430] text-[#1a1a1a]' : 'bg-united-red text-white',
      )}
    >
      {num}
    </span>
    <span className="max-w-[72px] text-center text-[11px] font-semibold leading-[1.1] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
      {name}
    </span>
  </div>
);

export { PitchToken, type PitchTokenProps };
