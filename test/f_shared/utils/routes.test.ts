import { describe, it, expect } from 'vitest';
import { routes } from '@shared/utils';

const buildAll = () => Object.values(routes).map((build) => build());

describe('routes', () => {
  describe('개별 라우트', () => {
    it.each([
      ['home', '/', routes.home],
      ['season', '/season', routes.season],
      ['players', '/players', routes.players],
      ['club', '/club', routes.club],
      ['highlights', '/highlights', routes.highlights],
      ['news', '/news', routes.news],
    ] as const)('%s는 %s를 반환한다', (_name, expected, build) => {
      expect(build()).toBe(expected);
    });
  });

  describe('레지스트리 불변식', () => {
    it('모든 라우트가 "/"로 시작하는 절대 경로다', () => {
      expect(buildAll().every((href) => href.startsWith('/'))).toBe(true);
    });

    it('서로 다른 라우트가 같은 경로를 가리키지 않는다', () => {
      const hrefs = buildAll();
      expect(new Set(hrefs).size).toBe(hrefs.length);
    });

    it('경로에 트레일링 슬래시가 없다(home 제외)', () => {
      const nonRoot = buildAll().filter((href) => href !== '/');
      expect(nonRoot.every((href) => !href.endsWith('/'))).toBe(true);
    });
  });
});
