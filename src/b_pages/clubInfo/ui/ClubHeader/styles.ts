/**
 * 다크 배경(사진 히어로) 위 outline 버튼 override — ClubHeader 전용.
 * landing/HeroSection의 DARK_OUTLINE(같은 #0b0b0d 계열 다크 히어로)과 동일한 처리를
 * page-local로 colocate — 서로 다른 b_pages 슬라이스 간 상호 import는 결합도상 지양.
 */
export const DARK_OUTLINE = 'bg-transparent text-white border-[#3f3f46] hover:bg-[#1f1f23]';
