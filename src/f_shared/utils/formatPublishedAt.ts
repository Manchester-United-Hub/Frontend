/**
 * 발행일(publishedAt) 표시 포맷 — "YYYY.MM.DD".
 * 파싱 불가한 값은 원본을 그대로 반환한다(방어적).
 */
export const formatPublishedAt = (publishedAt: string): string => {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return publishedAt;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};
