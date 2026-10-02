/**
 * toSeasonSummaryCards 단위 테스트 — 컴포넌트 1:테스트 1 미러링(code-conventions §6).
 *
 * 이번 라운드에서 유일하게 새로 생긴 파생 로직이며, R2-3(숫자가 틀려도 화면상
 * 그럴듯해 보인다 — mock일 때는 '어차피 가짜'라는 공유된 이해가 있었지만 이제는
 * 사용자가 이 숫자를 믿는다)의 유일한 자동 방어선이다(result-ST2-02.md "ST2-04를
 * 위한 힌트").
 *
 * 기대값은 리터럴로 쓴다 — 대상 모듈의 플레이스홀더 상수(SUMMARY_PLACEHOLDER_VALUE
 * 등)를 import해 기대값을 만들면 그 상수 자체가 검증되지 않는다(1차 관례,
 * constants-need-literal-assertions).
 *
 * 검증 목적:
 * - 정상 매핑 4장(리그 순위·승점·득실차·전적) — 4번째 카드가 '전적'인지(D-12/CH-2)
 * - 4번째 카드의 sub는 승률(w/p, Math.round)이다(decision-3 §1) — 1번 카드가 이미
 *   '프리미어리그'를 말하므로 중복을 피하고 sub 슬롯의 계약("value를 한정하는
 *   정보")을 지킨다. p===0(개막 전)에서는 0/0 → NaN 대신 플레이스홀더를 쓴다.
 * - 부호 처리 3케이스: diff>0 → '+7', diff===0 → '0'('+0' 아님), diff<0 → '-3'('+-3' 아님)
 * - 맨유가 배열 첫 행이 아닌 경우 — index가 아니라 utd 플래그로 찾는지
 * - standings===null → 플레이스홀더 4장
 * - utd 행이 없는 배열 → 플레이스홀더 4장
 * - 아이콘 키·배열 길이 불변식(ICON_MAP이 그대로 동작해야 한다)
 */

import { describe, expect, it } from 'vitest';

import { toSeasonSummaryCards } from '@pages/season/model';
import type { Standing } from '@entities/rank/types';

// 픽스처는 이 파일 안에서 직접 구성한다 — convertPLRankDTO2DAO를 거치지 않는다
// (toSeasonSummaryCards의 입력 계약은 Standing[]이지 DTO가 아니다).
const createStanding = (overrides: Partial<Standing> = {}): Standing => ({
  teamLogoUrl: 'https://media.api-sports.io/football/teams/33.png',
  pos: 8,
  code: 'MUN',
  nm: '맨체스터 유나이티드',
  p: 29,
  w: 14,
  d: 5,
  l: 10,
  gf: 45,
  ga: 38,
  diff: 7,
  pts: 47,
  form: ['W', 'D', 'L', 'W', 'L'],
  mv: 'same',
  zone: '',
  ...overrides,
});

const otherTeam = (overrides: Partial<Standing> = {}): Standing =>
  createStanding({
    teamLogoUrl: 'https://media.api-sports.io/football/teams/50.png',
    code: 'MCI',
    nm: '맨체스터 시티',
    utd: undefined,
    ...overrides,
  });

describe('toSeasonSummaryCards', () => {
  it('맨유 행이 있으면 4장의 value·sub가 그 행에서 파생된다 (4번째 카드는 전적)', () => {
    const utd = createStanding({ utd: true });

    expect(toSeasonSummaryCards([utd])).toEqual([
      {
        icon: 'BarChart3',
        label: '리그 순위',
        en: 'Position',
        value: '8위',
        sub: '프리미어리그',
      },
      {
        icon: 'Star',
        label: '승점',
        en: 'Points',
        value: '47',
        sub: '29경기',
      },
      {
        icon: 'Target',
        label: '득실차',
        en: 'Goal Diff',
        value: '+7',
        sub: '45득점 38실점',
      },
      {
        icon: 'Trophy',
        label: '전적',
        en: 'Record',
        value: '14승 5무 10패',
        sub: '승률 48%',
      },
    ]);
  });

  it('승률은 Math.round로 반올림한다 (w:1 / p:8 → 12.5% → "승률 13%")', () => {
    const utd = createStanding({ utd: true, w: 1, d: 3, l: 4, p: 8 });
    const [, , , recordCard] = toSeasonSummaryCards([utd]);
    expect(recordCard.sub).toBe('승률 13%');
  });

  it('경기 수가 0이면 승률 대신 플레이스홀더를 쓴다 (0/0 → NaN 방지)', () => {
    const utd = createStanding({ utd: true, p: 0, w: 0, d: 0, l: 0 });
    const [, , , recordCard] = toSeasonSummaryCards([utd]);
    expect(recordCard.value).toBe('0승 0무 0패');
    expect(recordCard.sub).toBe('정보 없음');
    expect(recordCard.sub).not.toContain('NaN');
  });

  it('승률은 승(w)/경기수(p)로 계산한다 (d·l을 섞지 않는다)', () => {
    const utd = createStanding({ utd: true, w: 10, d: 5, l: 5, p: 20 });
    const [, , , recordCard] = toSeasonSummaryCards([utd]);
    expect(recordCard.sub).toBe('승률 50%'); // 10/20. (10+5)/20=75%·10/(10+5+5)=50%와 구분되도록
    expect(recordCard.value).toBe('10승 5무 5패');
  });

  it('득실차가 양수면 +를 붙인다 (diff: 7 → "+7")', () => {
    const utd = createStanding({ utd: true, diff: 7 });

    const [, , goalDiffCard] = toSeasonSummaryCards([utd]);
    expect(goalDiffCard.value).toBe('+7');
  });

  it('득실차가 0이면 부호 없이 "0"을 반환한다 ("+0"이 아니다)', () => {
    const utd = createStanding({ utd: true, diff: 0 });

    const [, , goalDiffCard] = toSeasonSummaryCards([utd]);
    expect(goalDiffCard.value).toBe('0');
  });

  it('득실차가 음수면 "-3"을 반환한다 ("+-3"이 아니다)', () => {
    const utd = createStanding({ utd: true, diff: -3 });

    const [, , goalDiffCard] = toSeasonSummaryCards([utd]);
    expect(goalDiffCard.value).toBe('-3');
  });

  it('맨유가 배열 첫 행이 아니어도 utd 플래그로 정확히 찾는다', () => {
    const standings: Standing[] = [
      otherTeam({ pos: 1, pts: 78 }),
      otherTeam({ pos: 5, pts: 55, code: 'CHE', nm: '첼시' }),
      createStanding({ pos: 8, pts: 47, diff: 7, utd: true }),
      otherTeam({ pos: 15, pts: 35, code: 'FUL', nm: '풀럼' }),
    ];

    const [positionCard, pointsCard] = toSeasonSummaryCards(standings);
    expect(positionCard.value).toBe('8위');
    expect(pointsCard.value).toBe('47');
  });

  it('standings가 null이면 4장 모두 플레이스홀더를 반환하고 label·en·icon은 유지된다', () => {
    expect(toSeasonSummaryCards(null)).toEqual([
      {
        icon: 'BarChart3',
        label: '리그 순위',
        en: 'Position',
        value: '—',
        sub: '정보 없음',
      },
      {
        icon: 'Star',
        label: '승점',
        en: 'Points',
        value: '—',
        sub: '정보 없음',
      },
      {
        icon: 'Target',
        label: '득실차',
        en: 'Goal Diff',
        value: '—',
        sub: '정보 없음',
      },
      {
        icon: 'Trophy',
        label: '전적',
        en: 'Record',
        value: '—',
        sub: '정보 없음',
      },
    ]);
  });

  it('맨유 행이 없는 배열이면 null과 동일한 플레이스홀더 4장을 반환한다', () => {
    const standingsWithoutUtd: Standing[] = [
      otherTeam({ pos: 1 }),
      otherTeam({ pos: 5, code: 'CHE', nm: '첼시' }),
    ];

    const cards = toSeasonSummaryCards(standingsWithoutUtd);
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.value)).toEqual(['—', '—', '—', '—']);
    expect(cards.map((card) => card.sub)).toEqual([
      '정보 없음',
      '정보 없음',
      '정보 없음',
      '정보 없음',
    ]);
    expect(cards.map((card) => card.label)).toEqual([
      '리그 순위',
      '승점',
      '득실차',
      '전적',
    ]);
  });

  it('빈 배열이면 플레이스홀더 4장을 반환한다', () => {
    const cards = toSeasonSummaryCards([]);
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.value)).toEqual(['—', '—', '—', '—']);
    expect(cards.map((card) => card.sub)).toEqual([
      '정보 없음',
      '정보 없음',
      '정보 없음',
      '정보 없음',
    ]);
    expect(cards.map((card) => card.label)).toEqual([
      '리그 순위',
      '승점',
      '득실차',
      '전적',
    ]);
  });

  it('반환 배열 길이는 항상 4이고 icon은 ICON_MAP 키와 일치하며 4번째 카드 en은 Record다', () => {
    const utd = createStanding({ utd: true });
    const normal = toSeasonSummaryCards([utd]);
    const placeholder = toSeasonSummaryCards(null);

    expect(normal).toHaveLength(4);
    expect(placeholder).toHaveLength(4);

    const iconMapKeys = ['BarChart3', 'Star', 'Target', 'Trophy'];
    normal.forEach((card) => expect(iconMapKeys).toContain(card.icon));
    placeholder.forEach((card) => expect(iconMapKeys).toContain(card.icon));

    expect(normal[3].en).toBe('Record');
    expect(placeholder[3].en).toBe('Record');
  });
});
