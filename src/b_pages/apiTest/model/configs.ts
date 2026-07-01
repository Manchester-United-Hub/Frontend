import { CategoryDef } from './types';

const CATEGORIES: CategoryDef[] = [
  {
    name: 'News',
    endpoints: [
      {
        name: 'Recent News',
        path: '/api/v1/news?preview=1',
        fields: [],
      },
      {
        name: 'News List',
        path: '/api/v1/news',
        fields: [
          {
            name: 'cursorAt',
            label: 'Cursor At',
            type: 'text',
            required: true,
            placeholder: '2024-01-01T00:00',
            paramType: 'query',
          },
          {
            name: 'cursorId',
            label: 'Cursor ID',
            type: 'number',
            required: true,
            placeholder: '0',
            defaultValue: '0',
            paramType: 'query',
          },
          {
            name: 'size',
            label: 'Size',
            type: 'number',
            required: true,
            placeholder: '10',
            defaultValue: '10',
            paramType: 'query',
          },
        ],
      },
    ],
  },
  {
    name: 'Player',
    endpoints: [
      {
        name: 'Player List',
        path: '/api/v1/player',
        fields: [
          {
            name: 'season',
            label: 'Season',
            type: 'number',
            required: true,
            placeholder: '2024',
            defaultValue: '2024',
            paramType: 'query',
          },
          {
            name: 'position',
            label: 'Position',
            type: 'text',
            placeholder: 'e.g. Forward (optional)',
            paramType: 'query',
          },
        ],
      },
    ],
  },
  {
    name: 'Team',
    endpoints: [
      {
        name: 'Statistics',
        path: '/api/v1/team/statistics',
        fields: [],
      },
      {
        name: 'Team Info',
        path: '/api/v1/team/{teamId}',
        fields: [
          {
            name: 'teamId',
            label: 'Team ID',
            type: 'number',
            required: true,
            placeholder: '33',
            paramType: 'path',
          },
        ],
      },
    ],
  },
  {
    name: 'Game',
    endpoints: [
      {
        name: 'Schedule',
        path: '/api/v1/game/schedule',
        fields: [],
      },
      {
        name: 'Game Detail',
        path: '/api/v1/game/{fixtureId}/detail',
        fields: [
          {
            name: 'fixtureId',
            label: 'Fixture ID',
            type: 'number',
            required: true,
            placeholder: '12345',
            paramType: 'path',
          },
        ],
      },
      {
        name: 'Lineups',
        path: '/api/v1/game/{fixtureId}/lineups',
        fields: [
          {
            name: 'fixtureId',
            label: 'Fixture ID',
            type: 'number',
            required: true,
            placeholder: '12345',
            paramType: 'path',
          },
        ],
      },
    ],
  },
];

export { CATEGORIES };
