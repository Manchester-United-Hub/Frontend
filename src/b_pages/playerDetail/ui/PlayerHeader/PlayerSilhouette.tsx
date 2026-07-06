/**
 * 선수 사진 자리표시자 실루엣 — 사진 자산 없음(design_ref player-detail.jsx의
 * `Silhouette`). ManagerTab/Silhouette.tsx와 동일한 마크업(장식용 아이콘,
 * `.pd-photo .silhouette` 스펙: width/height 60%, muted-foreground 36% 톤)을
 * playerDetail 슬라이스 내부에 페이지 로컬로 둔다 — 서로 다른 b_pages 슬라이스
 * 간 상호 import는 결합도상 지양(clubInfo/ClubHeader의 DARK_OUTLINE 선례와 동일 판단).
 */
export function PlayerSilhouette() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-3/5 w-3/5 text-[color-mix(in_srgb,var(--muted-foreground)_36%,transparent)]"
    >
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.6-9 6v2h18v-2c0-3.4-4-6-9-6Z" />
    </svg>
  );
}
