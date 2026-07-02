import { Card } from '@shared/ui';
import { cn } from '@shared/utils';

export type RecordVariant = 'default' | 'win' | 'loss';

export interface RecordCellData {
  k: string;
  n: number;
  variant?: RecordVariant;
}

const RECORD_NUMBER_COLOR: Record<RecordVariant, string> = {
  default: '',
  win: 'text-win',
  loss: 'text-united-red',
};

/** 성적 요약 1셀(경기/승/무/패 — 숫자 + 라벨). */
export function RecordCell({ k, n, variant = 'default' }: RecordCellData) {
  return (
    <Card padding="md" className="text-center">
      <div className={cn('text-[28px] font-extrabold tracking-[-0.02em]', RECORD_NUMBER_COLOR[variant])}>{n}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{k}</div>
    </Card>
  );
}
