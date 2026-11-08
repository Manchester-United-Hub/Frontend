/**
 * 감독 픽스처 — DTO는 swagger CoachGetResponse 계약, 기본값은 실측 응답(`/api/coaches/33`)에서
 * 옮기고 실측상 null인 필드는 채워 넣었다. careers는 정렬 검증을 위해 오래된 순으로 둔다.
 *
 * MANAGER_FIXTURE는 mapCoachToManager 결과가 아닌 손으로 쓴 화면 모델이다 — 매퍼를
 * 기대값 생성에 쓰면 매퍼 자체가 검증되지 않는다.
 */

import type { CoachDTO } from '@entities/coach/model';
import type { Manager } from '@pages/clubInfo/model/types';

const COACH_DTO_FIXTURE: CoachDTO = {
  id: 25762,
  teamId: 33,
  name: 'Michael Carrick',
  photo: 'https://example.com/coaches/25762.png',
  birthDate: '1981-07-28',
  birthPlace: 'Wallsend',
  appointmentDate: '2025-08-01',
  contractEndDate: '2027-06-30',
  nationality: 'England',
  careers: [
    { startDate: '2022-10-24', endDate: '2025-06-03', team: 'Middlesbrough' },
    { startDate: '2025-08-01', endDate: null, team: 'Manchester United' },
  ],
};

const MANAGER_FIXTURE: Manager = {
  name: 'Michael Carrick',
  photo: 'https://example.com/coaches/25762.png',
  role: '감독 · Head Coach',
  appointed: '2025년 8월',
  born: '1981년 7월 28일',
  birthplace: 'Wallsend',
  contract: '2027년 6월까지',
  nationality: 'England',
  careers: [
    { team: 'Manchester United', period: '2025.08 – 현재', now: true },
    { team: 'Middlesbrough', period: '2022.10 – 2025.06', now: false },
  ],
};

export { COACH_DTO_FIXTURE, MANAGER_FIXTURE };
