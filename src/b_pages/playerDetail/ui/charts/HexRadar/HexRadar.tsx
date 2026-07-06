import type { RadarPoint } from '../../../model/types';
import { getAttrLevel } from '../../../model/derive';
import { ATTR_LEVEL_COLOR } from '../attrLevelColor';

/**
 * Hexagon radar chart (능력치 육각형) — page-local chart (ADR-2: single usage,
 * not promoted to f_shared). Geometry ported 1:1 from design source
 * player-detail.jsx `Hexagon` (angles/rings/label-anchor table) so the visual
 * output matches the shadcn/ui design exactly.
 */

const CHART_WIDTH = 290;
const CHART_HEIGHT = 250;
const CENTER_X = 145;
const CENTER_Y = 122;
const RADIUS = 84;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];
const POINT_RADIUS = 3.4;
const LABEL_ANCHOR_RADIUS_FACTOR = 1.16;
const LABEL_VALUE_OFFSET = 14;

/** `HEX_LBL` from the design source — per-axis text-anchor + vertical offset. */
const HEX_LBL: { anchor: 'start' | 'middle' | 'end'; dy: number }[] = [
  { anchor: 'middle', dy: -7 },
  { anchor: 'start', dy: -1 },
  { anchor: 'start', dy: 8 },
  { anchor: 'middle', dy: 16 },
  { anchor: 'end', dy: 8 },
  { anchor: 'end', dy: -1 },
];

function getAxisAngle(index: number): number {
  return ((-90 + index * 60) * Math.PI) / 180;
}

function getAxisPoint(index: number, fraction: number): [number, number] {
  const angle = getAxisAngle(index);
  return [CENTER_X + RADIUS * fraction * Math.cos(angle), CENTER_Y + RADIUS * fraction * Math.sin(angle)];
}

export interface HexRadarProps {
  data: RadarPoint[];
  /** Fill/stroke color of the data polygon. Defaults to the brand accent used in every current usage. */
  color?: string;
}

export function HexRadar({ data, color = 'var(--united-red)' }: HexRadarProps) {
  const dataPolygonPoints = data.map((point, i) => getAxisPoint(i, point.v / 100).join(',')).join(' ');
  const ariaLabel = `능력치 육각형: ${data.map((point) => `${point.k} ${point.v}`).join(', ')}`;

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      className="w-full max-w-[300px] overflow-visible"
      role="img"
      aria-label={ariaLabel}
    >
      {RING_FRACTIONS.map((fraction) => (
        <polygon
          key={fraction}
          points={data.map((_, i) => getAxisPoint(i, fraction).join(',')).join(' ')}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1}
        />
      ))}
      {data.map((point, i) => {
        const [x, y] = getAxisPoint(i, 1);
        return <line key={point.k} x1={CENTER_X} y1={CENTER_Y} x2={x} y2={y} stroke="var(--border)" strokeWidth={1} />;
      })}
      <polygon
        points={dataPolygonPoints}
        fill={color}
        fillOpacity={0.16}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {data.map((point, i) => {
        const [x, y] = getAxisPoint(i, point.v / 100);
        return <circle key={point.k} cx={x} cy={y} r={POINT_RADIUS} fill={color} />;
      })}
      {data.map((point, i) => {
        const [labelX, labelY] = getAxisPoint(i, LABEL_ANCHOR_RADIUS_FACTOR);
        const anchorSpec = HEX_LBL[i];
        if (!anchorSpec) return null;
        const { anchor, dy } = anchorSpec;
        return (
          <g key={point.k}>
            <text x={labelX} y={labelY + dy} textAnchor={anchor} fontSize={12.5} fontWeight={600} fill="var(--foreground)">
              {point.k}
            </text>
            <text
              x={labelX}
              y={labelY + dy + LABEL_VALUE_OFFSET}
              textAnchor={anchor}
              fontSize={11}
              fontWeight={700}
              fill={ATTR_LEVEL_COLOR[getAttrLevel(point.v)]}
            >
              {point.v}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
