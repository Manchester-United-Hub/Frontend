import { describe, it, expect } from 'vitest';

import { toHighlightItem } from '@pages/highlights/model/toHighlightItem';
import { buildHighlightDTO } from '@test/fixtures/highlights';

describe('toHighlightItem', () => {
  it('DTO 필드를 화면용 필드로 옮긴다', () => {
    const dto = buildHighlightDTO();

    const item = toHighlightItem(dto);

    expect(item).toEqual({
      id: 'wwFPqhC51oY',
      title: 'Man Utd 0-3 Bournemouth | Highlights',
      thumbnailUrl: dto.thumbnailUrl,
      embedUrl: 'https://www.youtube.com/embed/wwFPqhC51oY',
      watchUrl: 'https://www.youtube.com/watch?v=wwFPqhC51oY',
      date: '2026.10.25',
      views: '809.1K',
    });
  });

  it('백만 단위 조회수를 M으로 축약한다', () => {
    expect(toHighlightItem(buildHighlightDTO({ viewCount: 2_563_023 })).views).toBe('2.6M');
  });

  it('조회수가 0(비공개)이면 views는 null이다', () => {
    expect(toHighlightItem(buildHighlightDTO({ viewCount: 0 })).views).toBeNull();
  });
});
