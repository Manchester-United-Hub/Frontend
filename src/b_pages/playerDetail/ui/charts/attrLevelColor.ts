import type { AttrLevel } from '../../model/types';

/**
 * getAttrLevel → token mapping for attribute value display color (design's
 * `attrColor(v)`). Single source of truth shared by HexRadar and
 * AttributeBarList (previously duplicated in each). Lives under `charts/`
 * so it stays a leaf module — AttributeCard imports from charts, not the
 * other way around.
 */
export const ATTR_LEVEL_COLOR: Record<AttrLevel, string> = {
  high: 'var(--united-red)',
  mid: 'var(--foreground)',
  low: 'var(--muted-foreground)',
};
