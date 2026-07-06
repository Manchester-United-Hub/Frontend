import type { ReactNode } from 'react';
import { ArrowRight, Cake, Footprints, Globe, MapPin, Plus, Ruler, Star, Target, Trophy } from 'lucide-react';

import { cn } from '@shared/utils';

import type { PlayerDetail } from '../../model/types';

/** 포지션 코드 → 한글 라벨. pd-tags(PlayerHeader)와 pd-info(여기)가 함께 참조. */
export const POSITION_LABEL: Record<PlayerDetail['pos'], string> = {
  GK: '골키퍼',
  DF: '수비수',
  MF: '미드필더',
  FW: '공격수',
};

const INFO_GRID_COLS_DESKTOP = 3;

interface InfoCellData {
  icon: ReactNode;
  label: string;
  value: string;
  /** true면 값 텍스트를 win 토큰으로 강조(현역 "현재 상태" 셀 전용). */
  emphasize?: boolean;
}

function buildInfoCells(player: PlayerDetail): InfoCellData[] {
  const retired = player.status === 'retired';

  return [
    { icon: <Globe size={12} aria-hidden="true" />, label: '국적', value: player.nat },
    { icon: <Cake size={12} aria-hidden="true" />, label: '생년월일', value: `${player.dob} (${player.age}세)` },
    { icon: <MapPin size={12} aria-hidden="true" />, label: '출생지', value: player.birth },
    {
      icon: <Ruler size={12} aria-hidden="true" />,
      label: '신장 / 체중',
      value: `${player.height}cm · ${player.weight}kg`,
    },
    { icon: <Footprints size={12} aria-hidden="true" />, label: '주발', value: player.foot },
    {
      icon: <Target size={12} aria-hidden="true" />,
      label: '포지션',
      value: `${POSITION_LABEL[player.pos]} (${player.pos})`,
    },
    { icon: <Plus size={12} aria-hidden="true" />, label: '입단', value: player.joined },
    retired
      ? { icon: <ArrowRight size={12} aria-hidden="true" />, label: '방출 / 은퇴', value: player.left ?? '-' }
      : {
          icon: <Star size={12} aria-hidden="true" />,
          label: '현재 상태',
          value: '현역 · 1군',
          emphasize: true,
        },
    { icon: <Trophy size={12} aria-hidden="true" />, label: '우승 트로피', value: `${player.trophies}회` },
  ];
}

/**
 * 셀 우측 보더 클래스 — design_ref `.pd-info .cell` 규칙을 그대로 재현한다.
 * 데스크톱(3열)은 3의 배수(마지막 열)만 보더 제거, 모바일(max-620px·2열
 * 폴백)은 왼쪽 열(짝수 index)만 보더를 유지 — 두 레이아웃의 교집합/차집합을
 * 그대로 계산해 원본 CSS의 `nth-child(3n)`/`nth-child(2n)` 캐스케이드와
 * 동일한 결과를 낸다(9번째 셀이 모바일에서 홀로 남는 엣지케이스 포함).
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

/** pd-info — 선수 신상 9칸 정보 그리드(3열 → 모바일 2열). 8번째 셀만 현역/은퇴 분기. */
export function PlayerInfoGrid({ player }: PlayerInfoGridProps) {
  const cells = buildInfoCells(player);

  return (
    <dl className="mt-[22px] grid grid-cols-3 overflow-hidden rounded-lg border border-border max-[620px]:grid-cols-2">
      {cells.map((cell, index) => (
        <div key={cell.label} className={cn('border-b border-border px-4 py-3.5', getInfoCellBorderClass(index))}>
          <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            {cell.icon}
            {cell.label}
          </dt>
          <dd className={cn('m-0 mt-[5px] text-base font-bold', cell.emphasize && 'text-win')}>{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}
