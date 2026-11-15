import type { LineupPlayer, LiveMatch, TeamLineup } from './types';

const unitedKeeper: LineupPlayer = {
  id: 101,
  number: 31,
  name: '라멘스',
  nameEn: 'Senne Lammens',
  position: 'GK',
  grid: '1:1',
  marks: [],
};

const unitedOutfieldStarters: LineupPlayer[] = [
  { id: 102, number: 13, name: '도르구', nameEn: 'Patrick Dorgu', position: 'DF', grid: '2:1', marks: [] },
  { id: 103, number: 5, name: '매과이어', nameEn: 'Harry Maguire', position: 'DF', grid: '2:2', marks: [] },
  { id: 104, number: 4, name: '더리흐트', nameEn: 'Matthijs de Ligt', position: 'DF', grid: '2:3', marks: [] },
  { id: 105, number: 2, name: '달롯', nameEn: 'Diogo Dalot', position: 'DF', grid: '2:4', marks: [] },
  { id: 106, number: 37, name: '마이누', nameEn: 'Kobbie Mainoo', position: 'MF', grid: '3:1', marks: [] },
  {
    id: 107,
    number: 8,
    name: '브루노 페르난데스',
    nameEn: 'Bruno Fernandes',
    position: 'MF',
    grid: '3:3',
    marks: [{ type: 'goal', minute: "23'" }],
  },
  { id: 108, number: 10, name: '쿠냐', nameEn: 'Matheus Cunha', position: 'FW', grid: '4:1', marks: [] },
  { id: 109, number: 30, name: '셰슈코', nameEn: 'Benjamin Šeško', position: 'FW', grid: '4:2', marks: [] },
  {
    id: 110,
    number: 19,
    name: '음뵈모',
    nameEn: 'Bryan Mbeumo',
    position: 'FW',
    grid: '4:3',
    marks: [{ type: 'goal', minute: "58'" }],
  },
];

const unitedSubbedOff: LineupPlayer = {
  id: 111,
  number: 18,
  name: '카세미루',
  nameEn: 'Casemiro',
  position: 'MF',
  grid: null,
  marks: [
    { type: 'yellowCard', minute: "34'" },
    { type: 'subOut', minute: "60'" },
  ],
};

const unitedSubbedOn: LineupPlayer = {
  id: 112,
  number: 25,
  name: '우가르테',
  nameEn: 'Manuel Ugarte',
  position: 'MF',
  grid: '3:2',
  marks: [{ type: 'subIn', minute: "60'" }],
};

const unitedBench: LineupPlayer[] = [
  { id: 113, number: 1, name: '바이은드르', nameEn: 'Altay Bayındır', position: 'GK', grid: null, marks: [] },
  { id: 114, number: 15, name: '요로', nameEn: 'Leny Yoro', position: 'DF', grid: null, marks: [] },
  { id: 115, number: 6, name: '리산드로 마르티네스', nameEn: 'Lisandro Martínez', position: 'DF', grid: null, marks: [] },
  { id: 116, number: 23, name: '쇼', nameEn: 'Luke Shaw', position: 'DF', grid: null, marks: [] },
  unitedSubbedOn,
  { id: 117, number: 7, name: '마운트', nameEn: 'Mason Mount', position: 'MF', grid: null, marks: [] },
  { id: 118, number: 11, name: '지르크제이', nameEn: 'Joshua Zirkzee', position: 'FW', grid: null, marks: [] },
];

const unitedLineup: TeamLineup = {
  formation: '4-3-3',
  onPitch: [unitedKeeper, ...unitedOutfieldStarters, unitedSubbedOn],
  starters: [unitedKeeper, ...unitedOutfieldStarters, unitedSubbedOff],
  substitutes: unitedBench,
};

const opponentKeeper: LineupPlayer = {
  id: 201,
  number: 23,
  name: '에밀리아노 마르티네스',
  nameEn: 'Emiliano Martínez',
  position: 'GK',
  grid: '1:1',
  marks: [],
};

const opponentOutfieldStarters: LineupPlayer[] = [
  { id: 202, number: 12, name: '디뉴', nameEn: 'Lucas Digne', position: 'DF', grid: '2:1', marks: [] },
  { id: 203, number: 14, name: '토레스', nameEn: 'Pau Torres', position: 'DF', grid: '2:2', marks: [] },
  {
    id: 204,
    number: 4,
    name: '콘사',
    nameEn: 'Ezri Konsa',
    position: 'DF',
    grid: '2:3',
    marks: [{ type: 'yellowCard', minute: "40'" }],
  },
  { id: 205, number: 2, name: '캐시', nameEn: 'Matty Cash', position: 'DF', grid: '2:4', marks: [] },
  { id: 206, number: 27, name: '로저스', nameEn: 'Morgan Rogers', position: 'MF', grid: '3:1', marks: [] },
  { id: 207, number: 44, name: '카마라', nameEn: 'Boubacar Kamara', position: 'MF', grid: '3:2', marks: [] },
  { id: 208, number: 8, name: '틸레만스', nameEn: 'Youri Tielemans', position: 'MF', grid: '3:3', marks: [] },
  { id: 209, number: 7, name: '맥긴', nameEn: 'John McGinn', position: 'MF', grid: '3:4', marks: [] },
  {
    id: 210,
    number: 11,
    name: '왓킨스',
    nameEn: 'Ollie Watkins',
    position: 'FW',
    grid: '4:1',
    marks: [{ type: 'goal', minute: "51'" }],
  },
];

const opponentSubbedOff: LineupPlayer = {
  id: 211,
  number: 10,
  name: '부엔디아',
  nameEn: 'Emiliano Buendía',
  position: 'FW',
  grid: null,
  marks: [{ type: 'subOut', minute: "65'" }],
};

const opponentSubbedOn: LineupPlayer = {
  id: 212,
  number: 17,
  name: '말런',
  nameEn: 'Donyell Malen',
  position: 'FW',
  grid: '4:2',
  marks: [{ type: 'subIn', minute: "65'" }],
};

const opponentBench: LineupPlayer[] = [
  { id: 213, number: 40, name: '비조', nameEn: 'Marco Bizot', position: 'GK', grid: null, marks: [] },
  { id: 214, number: 5, name: '밍스', nameEn: 'Tyrone Mings', position: 'DF', grid: null, marks: [] },
  { id: 215, number: 22, name: '마트선', nameEn: 'Ian Maatsen', position: 'DF', grid: null, marks: [] },
  { id: 216, number: 24, name: '오나나', nameEn: 'Amadou Onana', position: 'MF', grid: null, marks: [] },
  { id: 217, number: 6, name: '바클리', nameEn: 'Ross Barkley', position: 'MF', grid: null, marks: [] },
  opponentSubbedOn,
  { id: 218, number: 31, name: '베일리', nameEn: 'Leon Bailey', position: 'FW', grid: null, marks: [] },
];

const opponentLineup: TeamLineup = {
  formation: '4-4-2',
  onPitch: [opponentKeeper, ...opponentOutfieldStarters, opponentSubbedOn],
  starters: [opponentKeeper, ...opponentOutfieldStarters, opponentSubbedOff],
  substitutes: opponentBench,
};

const liveMatchMock: LiveMatch = {
  status: 'live',
  competition: '프리미어리그 · 32라운드',
  venue: '올드 트래퍼드',
  period: '후반',
  clock: "67'",
  home: { name: '맨유', code: 'MUN', score: 2, isUnited: true },
  away: { name: '빌라', code: 'AVL', score: 1, isUnited: false },
  lineups: {
    united: unitedLineup,
    opponent: opponentLineup,
  },
  commentary: [
    { id: 'c-13', minute: "67'", side: 'united', kind: 'chance', text: '음뵈모의 오른발 슈팅이 마르티네스 정면으로 향합니다.' },
    { id: 'c-12', minute: "65'", side: 'opponent', kind: 'sub', text: '부엔디아가 나가고 말런이 들어갑니다.' },
    { id: 'c-11', minute: "60'", side: 'united', kind: 'sub', text: '카세미루가 나가고 우가르테가 들어갑니다.' },
    { id: 'c-10', minute: "58'", side: 'united', kind: 'goal', text: '음뵈모가 페르난데스의 스루패스를 받아 마무리합니다. 맨유 2-1.' },
    { id: 'c-09', minute: "51'", side: 'opponent', kind: 'goal', text: '왓킨스가 헤더로 동점을 만듭니다. 1-1.' },
    { id: 'c-08', minute: "46'", side: 'neutral', kind: 'period', text: '후반 시작.' },
    { id: 'c-07', minute: "45+2'", side: 'neutral', kind: 'period', text: '전반 종료. 맨유 1-0 리드.' },
    { id: 'c-06', minute: "40'", side: 'opponent', kind: 'yellowCard', text: '콘사가 쿠냐를 넘어뜨려 경고를 받습니다.' },
    { id: 'c-05', minute: "34'", side: 'united', kind: 'yellowCard', text: '카세미루가 늦은 태클로 경고를 받습니다.' },
    { id: 'c-04', minute: "23'", side: 'united', kind: 'goal', text: '페르난데스가 페널티킥을 성공시킵니다. 맨유 1-0.' },
    { id: 'c-03', minute: "22'", side: 'united', kind: 'penalty', text: '쿠냐가 박스 안에서 넘어지며 페널티킥이 선언됩니다.' },
    { id: 'c-02', minute: "12'", side: 'opponent', kind: 'chance', text: '로저스의 왼발 슈팅이 골대를 살짝 벗어납니다.' },
    { id: 'c-01', minute: "1'", side: 'neutral', kind: 'period', text: '경기 시작.' },
  ],
};

export { liveMatchMock };
