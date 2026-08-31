import { cn } from '@shared/utils';

import { getZoneColorStyle } from '../model';
import { zoneLegend } from './configs';

/** ZoneLegend — 순위존 범례(챔피언스리그·유로파리그·컨퍼런스리그·강등권 4개). */
export function ZoneLegend() {
  return (
    <ul
      role="list"
      aria-label="순위표 존 범례"
      className="flex flex-wrap gap-4"
    >
      {zoneLegend.map((item) => {
        const { className, style } = getZoneColorStyle(item.zone);
        return (
          <li
            key={item.zone}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className={cn('h-2.5 w-2.5 rounded-sm', className)}
              style={style}
            />
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
