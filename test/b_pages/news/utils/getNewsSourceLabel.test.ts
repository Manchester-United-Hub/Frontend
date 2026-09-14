import { describe, it, expect } from 'vitest';
import { getNewsSourceLabel } from '@pages/news/utils/getNewsSourceLabel';

describe('getNewsSourceLabel', () => {
  it('m. 접두사가 붙은 네이버 스포츠 호스트를 매핑된 라벨로 반환한다', () => {
    expect(
      getNewsSourceLabel(
        'https://m.sports.naver.com/wfootball/article/117/0004102817'
      )
    ).toBe('네이버 스포츠');
  });

  it('네이버 뉴스 호스트를 매핑된 라벨로 반환한다', () => {
    expect(
      getNewsSourceLabel('https://news.naver.com/article/001/0000000000')
    ).toBe('네이버 뉴스');
  });

  it('www. 접두사가 붙은 스포츠투데이 호스트를 매핑된 라벨로 반환한다', () => {
    expect(
      getNewsSourceLabel('http://www.stoo.com/article.php?aid=108742561815')
    ).toBe('스포츠투데이');
  });

  it('매핑에 없는 호스트는 정규화된 호스트명 그대로 반환한다', () => {
    expect(getNewsSourceLabel('https://www.bbc.co.uk/sport/football')).toBe(
      'bbc.co.uk'
    );
  });

  it('잘못된 URL은 빈 문자열을 반환한다', () => {
    expect(getNewsSourceLabel('not a url')).toBe('');
  });

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(getNewsSourceLabel('')).toBe('');
  });
});
