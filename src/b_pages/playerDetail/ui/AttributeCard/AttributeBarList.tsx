import type { RadarPoint } from '../../model/types';
import { getAttrLevel } from '../../model/derive';
import { ATTR_LEVEL_COLOR } from '../charts/attrLevelColor';

export interface AttributeBarListProps {
  radar: RadarPoint[];
}

export function AttributeBarList({ radar }: AttributeBarListProps) {
  return (
    <div className="flex flex-col gap-3">
      {radar.map((point) => {
        const color = ATTR_LEVEL_COLOR[getAttrLevel(point.v)];
        return (
          <div key={point.k} className="grid grid-cols-[68px_1fr_30px] items-center gap-3">
            <span className="text-[13px] font-medium text-muted-foreground">{point.k}</span>
            <span className="block h-[7px] overflow-hidden rounded-full bg-muted">
              <span
                className="block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-in-out"
                style={{ width: `${point.v}%`, backgroundColor: color }}
              />
            </span>
            <span className="text-right text-sm font-bold" style={{ color }}>
              {point.v}
            </span>
          </div>
        );
      })}
    </div>
  );
}
