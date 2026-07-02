import type { FormationCoordinate, SquadPlayer } from '../../model/types';
import { PitchToken } from './PitchToken';

const VIEWBOX_WIDTH = 68;
const VIEWBOX_HEIGHT = 92;
const LINE_STROKE = 'rgba(255,255,255,0.55)';
const LINE_WIDTH = 0.4;
const SPOT_RADIUS = 0.6;

/**
 * 정적 피치 라인 마크업 — props/state에 의존하지 않으므로 컴포넌트 밖으로 호이스팅
 * (code-conventions §2). 사용처는 SquadPitch 한 곳뿐이라 별도 파일로 분리하지 않는다.
 */
const PITCH_LINES = (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <g fill="none" stroke={LINE_STROKE} strokeWidth={LINE_WIDTH}>
      <rect x={1} y={1} width={66} height={90} />
      <line x1={1} y1={46} x2={67} y2={46} />
      <circle cx={34} cy={46} r={9} />
      {/* GK 진영(하단) 박스 */}
      <rect x={14} y={76} width={40} height={15} />
      <rect x={24} y={85} width={20} height={6} />
      {/* 공격 진영(상단) 박스 */}
      <rect x={14} y={1} width={40} height={15} />
      <rect x={24} y={1} width={20} height={6} />
    </g>
    <circle cx={34} cy={46} r={SPOT_RADIUS} fill={LINE_STROKE} />
    <circle cx={34} cy={81} r={SPOT_RADIUS} fill={LINE_STROKE} />
    <circle cx={34} cy={11} r={SPOT_RADIUS} fill={LINE_STROKE} />
  </svg>
);

interface SquadPitchProps {
  /** `lineup[i]`와 인덱스로 페어링되는 좌표 11개(useFormation의 파생 결과). */
  tokens: FormationCoordinate[];
  lineup: SquadPlayer[];
}

/** 페이지 전용 SVG 잔디 피치 — 좌표+라인업을 받아 토큰을 배치만 하는 표현 전용 컴포넌트. */
const SquadPitch = ({ tokens, lineup }: SquadPitchProps) => (
  <div className="relative aspect-[68/92] w-full overflow-hidden rounded-lg border border-[color-mix(in_srgb,#1b5e34_60%,#000)] bg-[repeating-linear-gradient(0deg,#2f7d49_0_9.09%,#2b7444_9.09%_18.18%)] max-lg:mx-auto max-lg:max-w-[480px]">
    {PITCH_LINES}
    {tokens.map((coord, index) => {
      const player = lineup[index];
      if (!player) return null;
      return (
        <PitchToken
          key={player.num}
          x={coord.x}
          y={coord.y}
          num={player.num}
          name={player.nm}
          isGoalkeeper={player.role === 'GK'}
        />
      );
    })}
  </div>
);

export { SquadPitch, type SquadPitchProps };
