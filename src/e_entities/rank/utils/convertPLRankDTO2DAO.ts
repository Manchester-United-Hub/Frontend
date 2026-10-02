import {
  FormResult,
  PLRankDTO,
  PLRankTeamDTO,
  Standing,
  StandingZone,
} from '@entities/rank/types';

import { PL_TEAM_CODE, PL_TEAM_KOREAN_NAME } from '@shared/configs';

type PLRankTeamForm = PLRankTeamDTO['form'];

const UCL_ZONE_START_POS = 1;
const UCL_ZONE_END_POS = 4;
const UEL_ZONE_POS = 5;
const CONF_ZONE_POS = 6;
const RELEGATION_ZONE_START_POS = 18;
const RELEGATION_ZONE_END_POS = 20;

const getZoneByPosition = (pos: number): StandingZone => {
  if (pos >= UCL_ZONE_START_POS && pos <= UCL_ZONE_END_POS) {
    return 'ucl';
  }
  if (pos === UEL_ZONE_POS) {
    return 'uel';
  }
  if (pos === CONF_ZONE_POS) {
    return 'conf';
  }
  if (pos >= RELEGATION_ZONE_START_POS && pos <= RELEGATION_ZONE_END_POS) {
    return 'releg';
  }
  return '';
};

const makeFormResultArray = (form: PLRankTeamForm): FormResult[] | [] => {
  if (!form || form === null) {
    return [];
  }
  const formResultArray = form.split('') as FormResult[];
  const hasError = formResultArray.some((char) => {
    if (char !== 'W' && char !== 'D' && char !== 'L') {
      return 1;
    }
    return 0;
  });

  if (hasError) {
    throw new Error(
      "FormConvertError: form is not composed of 'W' or 'D' or 'L'."
    );
  }
  return formResultArray;
};

const convertPLRankDTO2DAO = ({ ranks }: PLRankDTO): Standing[] => {
  const standings: Standing[] = ranks.map((rank) => {
    const standing: Standing = {
      pos: rank.rank,
      code: PL_TEAM_CODE[rank.teamName] ?? rank.teamName,
      teamLogoUrl: rank.teamLogo,
      nm: PL_TEAM_KOREAN_NAME[rank.teamName] ?? rank.teamName,
      p: rank.win + rank.draw + rank.lose,
      w: rank.win,
      d: rank.draw,
      l: rank.lose,
      gf: rank.goalsFor,
      ga: rank.goalsAgainst,
      pts: rank.points,
      form: makeFormResultArray(rank.form),
      mv: 'same',
      diff: rank.goalsDiff,
      zone: getZoneByPosition(rank.rank),
      utd: rank.teamId === 33 ? true : undefined,
    };
    return standing;
  });
  return standings;
};

export { convertPLRankDTO2DAO };
