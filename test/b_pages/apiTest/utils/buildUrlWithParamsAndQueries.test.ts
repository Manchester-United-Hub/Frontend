import { describe, it, expect } from 'vitest';
import { buildUrlWithParamsAndQueries } from '@pages/apiTest/utils/buildUrlWithParamsAndQueries';

describe('buildUrlWithParamsAndQueries', () => {
  it('path paramType 필드를 {name} 플레이스홀더에 치환한다', () => {
    const endpoint = {
      name: 'Team Info',
      path: '/api/v1/team/{teamId}',
      fields: [
        {
          name: 'teamId',
          label: 'Team ID',
          type: 'number' as const,
          paramType: 'path' as const,
        },
      ],
    };

    expect(buildUrlWithParamsAndQueries(endpoint, { teamId: '33' })).toBe(
      '/api/v1/team/33'
    );
  });

  it('path param 값을 encodeURIComponent로 인코딩한다', () => {
    const endpoint = {
      name: 'Team Info',
      path: '/api/v1/team/{teamId}',
      fields: [
        {
          name: 'teamId',
          label: 'Team ID',
          type: 'text' as const,
          paramType: 'path' as const,
        },
      ],
    };

    expect(buildUrlWithParamsAndQueries(endpoint, { teamId: 'man utd' })).toBe(
      '/api/v1/team/man%20utd'
    );
  });

  it('query paramType 필드를 쿼리스트링으로 추가한다', () => {
    const endpoint = {
      name: 'News List',
      path: '/api/v1/news',
      fields: [
        {
          name: 'cursorId',
          label: 'Cursor ID',
          type: 'number' as const,
          paramType: 'query' as const,
        },
        {
          name: 'size',
          label: 'Size',
          type: 'number' as const,
          paramType: 'query' as const,
        },
      ],
    };

    expect(
      buildUrlWithParamsAndQueries(endpoint, { cursorId: '0', size: '10' })
    ).toBe('/api/v1/news?cursorId=0&size=10');
  });

  it('빈 문자열 값은 URL에 포함하지 않고 건너뛴다', () => {
    const endpoint = {
      name: 'Player List',
      path: '/api/v1/player',
      fields: [
        {
          name: 'season',
          label: 'Season',
          type: 'number' as const,
          paramType: 'query' as const,
        },
        {
          name: 'position',
          label: 'Position',
          type: 'text' as const,
          paramType: 'query' as const,
        },
      ],
    };

    expect(
      buildUrlWithParamsAndQueries(endpoint, { season: '2024', position: '' })
    ).toBe('/api/v1/player?season=2024');
  });

  it('endpoint.path에 기존 쿼리스트링이 있으면 신규 쿼리와 병합한다', () => {
    const endpoint = {
      name: 'Recent News',
      path: '/api/v1/news?preview=1',
      fields: [
        {
          name: 'size',
          label: 'Size',
          type: 'number' as const,
          paramType: 'query' as const,
        },
      ],
    };

    expect(buildUrlWithParamsAndQueries(endpoint, { size: '10' })).toBe(
      '/api/v1/news?preview=1&size=10'
    );
  });

  it('fields가 0개이면 path를 그대로 반환한다', () => {
    const endpoint = {
      name: 'Schedule',
      path: '/api/v1/match/schedule',
      fields: [],
    };

    expect(buildUrlWithParamsAndQueries(endpoint, {})).toBe(
      '/api/v1/match/schedule'
    );
  });

  it('values에 해당 키가 없으면 path param 플레이스홀더가 치환되지 않는다', () => {
    const endpoint = {
      name: 'Match Detail',
      path: '/api/v1/match/{matchId}/detail',
      fields: [
        {
          name: 'matchId',
          label: 'Match ID',
          type: 'number' as const,
          paramType: 'path' as const,
        },
      ],
    };

    expect(buildUrlWithParamsAndQueries(endpoint, {})).toBe(
      '/api/v1/match/{matchId}/detail'
    );
  });
});
