import { describe, expect, it } from 'vitest';

import { mapCoachToManager } from '@pages/clubInfo/model/mapCoachToManager';
import { COACH_DTO_FIXTURE, MANAGER_FIXTURE } from '@test/fixtures/coach';

describe('mapCoachToManager', () => {
  it('모든 필드가 있는 DTO를 화면 모델로 변환한다', () => {
    expect(mapCoachToManager(COACH_DTO_FIXTURE)).toEqual(MANAGER_FIXTURE);
  });

  it('null 필드는 "-"로, photo는 null 그대로 둔다', () => {
    const manager = mapCoachToManager({
      ...COACH_DTO_FIXTURE,
      photo: null,
      birthDate: null,
      birthPlace: null,
      appointmentDate: null,
      contractEndDate: null,
      nationality: null,
    });

    expect(manager).toMatchObject({
      photo: null,
      born: '-',
      birthplace: '-',
      appointed: '-',
      contract: '-',
      nationality: '-',
    });
  });

  it('날짜의 월·일 앞자리 0을 제거해 표시한다', () => {
    const manager = mapCoachToManager({
      ...COACH_DTO_FIXTURE,
      birthDate: '1990-01-05',
      appointmentDate: '2024-03-01',
      contractEndDate: '2026-09-30',
    });

    expect(manager.born).toBe('1990년 1월 5일');
    expect(manager.appointed).toBe('2024년 3월');
    expect(manager.contract).toBe('2026년 9월까지');
  });

  it('경력 기간은 "YYYY.MM" 형식으로 앞자리 0을 유지한다', () => {
    const manager = mapCoachToManager({
      ...COACH_DTO_FIXTURE,
      careers: [{ startDate: '2019-01-15', endDate: '2020-09-01', team: 'Club A' }],
    });

    expect(manager.careers).toEqual([{ team: 'Club A', period: '2019.01 – 2020.09', now: false }]);
  });

  it('경력은 startDate 내림차순으로 정렬하고 endDate가 null이면 현직으로 표시한다', () => {
    const manager = mapCoachToManager(COACH_DTO_FIXTURE);

    expect(manager.careers.map((career) => career.team)).toEqual(['Manchester United', 'Middlesbrough']);
    expect(manager.careers[0]).toEqual({ team: 'Manchester United', period: '2025.08 – 현재', now: true });
  });

  it('경력이 비어 있으면 빈 배열을 반환한다', () => {
    expect(mapCoachToManager({ ...COACH_DTO_FIXTURE, careers: [] }).careers).toEqual([]);
  });

  it('원본 DTO의 careers 배열을 변이하지 않는다', () => {
    const careersBefore = [...COACH_DTO_FIXTURE.careers];

    mapCoachToManager(COACH_DTO_FIXTURE);

    expect(COACH_DTO_FIXTURE.careers).toEqual(careersBefore);
  });
});
