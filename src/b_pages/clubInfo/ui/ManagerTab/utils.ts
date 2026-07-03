import type { Manager, ManagerRecord } from '../../model/types';
import type { InfoCellData } from './InfoCell';
import type { RecordCellData } from './RecordCell';

/** 승률(%) = round(w / p * WIN_RATE_SCALE) — 매직 넘버 100 상수화 */
const WIN_RATE_SCALE = 100;
/** p===0(0경기)일 때 승률 계산이 NaN이 되는 것을 막는 대체 표기 */
const WIN_RATE_UNAVAILABLE = '—';

/**
 * 승률(%) 표시 문자열 — 렌더 중 순수 파생 계산(useEffect 미사용).
 * p===0(0경기 재임)이면 0으로 나누어 NaN%가 되므로 대체 표기(WIN_RATE_UNAVAILABLE)로 가드한다.
 */
const formatWinRate = (record: ManagerRecord): string => {
  if (record.p === 0) return WIN_RATE_UNAVAILABLE;
  return `${Math.round((record.w / record.p) * WIN_RATE_SCALE)}%`;
};

/** 부임/계약/선호 포메이션/직전 경력 — 정보 그리드 4셀. model.manager를 dl 항목으로 변환. */
const buildInfoCells = (manager: Manager): InfoCellData[] => [
  { k: '부임', v: manager.appointed },
  { k: '계약 기간', v: manager.contract },
  { k: '선호 포메이션', v: manager.preferred },
  { k: '직전 경력', v: manager.prevClubs.join(' · '), small: true },
];

/** 경기/승/무/패 — 성적 요약 4셀. */
const buildRecordCells = (record: ManagerRecord): RecordCellData[] => [
  { k: '경기 P', n: record.p },
  { k: '승 W', n: record.w, variant: 'win' },
  { k: '무 D', n: record.d },
  { k: '패 L', n: record.l, variant: 'loss' },
];

export { formatWinRate, buildInfoCells, buildRecordCells };
