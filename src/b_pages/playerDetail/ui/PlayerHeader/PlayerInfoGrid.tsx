import type { ReactNode } from 'react';
import { Cake, Globe, Ruler, Target } from 'lucide-react';

import { cn } from '@shared/utils';

import type { PlayerDetail, PlayerPosition } from '../../model/types';

/** 포지션 코드 → 한글 라벨. pd-tags(PlayerHeader)와 pd-info(여기)가 함께 참조. */
export const POSITION_LABEL: Record<PlayerPosition, string> = {
  GK: '골키퍼',
  DF: '수비수',
  MF: '미드필더',
  FW: '공격수',
};

const INFO_GRID_COLS_DESKTOP = 4;
const UNKNOWN_VALUE = '-';

interface InfoCellData {
  icon: ReactNode;
  label: string;
  value: string;
}

/**
 * 인적사항 4칸(국적·생년월일·신장/체중·포지션)만 남긴다 — 출생지·주발·입단·
 * 방출(현재상태)·우승 트로피 5칸은 실 API(PlayerResponse)에 대응 필드가
 * 없어 셀 자체를 제거했다(D-23).
 *
 * 신장/체중(PD-3 판정, PD-2 인계 #3): D-23은 "API가 이미 단위 포함 문자열
 * (`"179 cm"`)로 준다"고 가정해 접미사를 제거했으나, 실 API를 직접 호출해
 * 확인한 결과(`GET /api/players/1485?season=2025` 등) `height`/`weight`는
 * 단위 없는 숫자 문자열(`"179"`/`"66"`)로 온다 — PD-1의 실측 보고와 일치.
 * 접미사 없이 숫자만 노출하면 사용자가 단위를 알 수 없으므로 여기서 cm/kg를
 * 직접 붙인다. height/weight/position은 null·미매핑 가능성이 있어(D-31,
 * PD-1) 전부 '-'로 방어한다.
 */
function buildInfoCells(player: PlayerDetail): InfoCellData[] {
  const heightText = player.height !== null ? `${player.height}cm` : UNKNOWN_VALUE;
  const weightText = player.weight !== null ? `${player.weight}kg` : UNKNOWN_VALUE;
  const positionText = player.pos ? `${POSITION_LABEL[player.pos]} (${player.pos})` : UNKNOWN_VALUE;

  return [
    { icon: <Globe size={12} aria-hidden="true" />, label: '국적', value: player.nat },
    { icon: <Cake size={12} aria-hidden="true" />, label: '생년월일', value: `${player.dob} (${player.age}세)` },
    {
      icon: <Ruler size={12} aria-hidden="true" />,
      label: '신장 / 체중',
      value: `${heightText} · ${weightText}`,
    },
    {
      icon: <Target size={12} aria-hidden="true" />,
      label: '포지션',
      value: positionText,
    },
  ];
}

/**
 * 셀 우측 보더 클래스 — design_ref `.pd-info .cell` 규칙을 재현한다.
 * 데스크톱(4열)은 4의 배수(마지막 열)만 보더 제거, 모바일(max-620px·2열
 * 폴백)은 왼쪽 열(짝수 index)만 보더를 유지 — 두 레이아웃의 교집합/차집합을
 * 그대로 계산해 `nth-child(4n)`/`nth-child(2n)` 캐스케이드와 동일한 결과를 낸다.
 */
function getInfoCellBorderClass(index: number): string {
  const desktopRight = (index + 1) % INFO_GRID_COLS_DESKTOP !== 0;
  const mobileRight = index % 2 === 0;

  if (desktopRight && mobileRight) return 'border-r';
  if (desktopRight && !mobileRight) return 'border-r max-[620px]:border-r-0';
  if (!desktopRight && mobileRight) return 'max-[620px]:border-r';
  return '';
}

export interface PlayerInfoGridProps {
  player: PlayerDetail;
}

/** pd-info — 선수 신상 4칸 정보 그리드(4열 → 모바일 2열). D-23: API 대응 필드만 남긴다. */
export function PlayerInfoGrid({ player }: PlayerInfoGridProps) {
  const cells = buildInfoCells(player);

  return (
    <dl className="mt-[22px] grid grid-cols-4 overflow-hidden rounded-lg border border-border max-[620px]:grid-cols-2">
      {cells.map((cell, index) => (
        <div key={cell.label} className={cn('border-b border-border px-4 py-3.5', getInfoCellBorderClass(index))}>
          <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            {cell.icon}
            {cell.label}
          </dt>
          <dd className="m-0 mt-[5px] text-base font-bold">{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}
