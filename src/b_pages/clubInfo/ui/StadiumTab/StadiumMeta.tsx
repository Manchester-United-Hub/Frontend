import { MapPin } from 'lucide-react';

import { Badge } from '@shared/ui';
import type { Stadium } from '../../model/types';
import { StadiumFactItem } from './StadiumFactItem';

export interface StadiumMetaProps {
  stadium: Stadium;
}

/** 뱃지(닉네임) + 구장명/영문명 + 팩트 4종 그리드 + 주소. */
export function StadiumMeta({ stadium }: StadiumMetaProps) {
  return (
    <div>
      <Badge variant="soft" className="mb-3.5">
        {stadium.nickname}
      </Badge>
      <h3 className="text-[26px] font-extrabold tracking-[-0.02em]">{stadium.name}</h3>
      <div className="mt-0.5 text-sm text-muted-foreground">{stadium.en}</div>

      <dl className="mt-5 grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
        {stadium.facts.map((fact) => (
          <StadiumFactItem key={fact.label} fact={fact} />
        ))}
      </dl>

      <div className="mt-[18px] flex items-start gap-2 text-sm leading-[1.5] text-muted-foreground">
        <MapPin size={16} className="mt-px flex-none" aria-hidden="true" />
        <span>{stadium.address}</span>
      </div>
    </div>
  );
}
