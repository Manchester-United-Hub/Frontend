import { ClubPage } from '@pages/clubInfo';

// ISR — 1시간마다 재생성한다(감독 API, players 페이지와 동일 주기).
export const revalidate = 3600;

export default function Club() {
  return (
    <>
      <ClubPage />
    </>
  );
}
