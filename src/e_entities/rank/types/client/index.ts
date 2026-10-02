export type FormResult = 'W' | 'D' | 'L';

export type StandingMovement = 'up' | 'down' | 'same';

export type StandingZone = 'ucl' | 'uel' | 'conf' | 'releg' | '';

export interface Standing {
  teamLogoUrl: string;
  pos: number;
  code: string;
  nm: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
  form: FormResult[];
  mv: StandingMovement;
  zone: StandingZone;
  diff: number;
  utd?: boolean;
}

export interface ZoneLegendItem {
  zone: Exclude<StandingZone, ''>;
  label: string;
}
