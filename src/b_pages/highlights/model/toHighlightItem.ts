import type { HighlightDTO } from '@entities/highlight/model';
import { formatPublishedAt } from '@shared/utils';

import type { HighlightItem } from './types';

const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch';

const VIEW_COUNT_FORMATTER = new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

// YouTube에서 조회수를 비공개로 설정한 영상은 0으로 내려와 표시하지 않는다.
const toViewCountLabel = (viewCount: number): string | null =>
  viewCount > 0 ? VIEW_COUNT_FORMATTER.format(viewCount) : null;

// 퍼가기를 막은 영상이 있어 embed 대신 YouTube 시청 페이지로 보낸다. API에 embeddable 여부가 생기면 재생 모달과 나눈다.
const toWatchUrl = (videoId: string): string =>
  `${YOUTUBE_WATCH_URL}?v=${encodeURIComponent(videoId)}`;

const toHighlightItem = (dto: HighlightDTO): HighlightItem => ({
  id: dto.videoId,
  title: dto.title,
  thumbnailUrl: dto.thumbnailUrl,
  embedUrl: dto.embedUrl,
  watchUrl: toWatchUrl(dto.videoId),
  date: formatPublishedAt(dto.publishedAt),
  views: toViewCountLabel(dto.viewCount),
});

export { toHighlightItem };
