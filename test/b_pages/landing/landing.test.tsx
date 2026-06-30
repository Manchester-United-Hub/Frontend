/**
 * @deprecated 이 파일은 테스트 미러링 분리(컴포넌트 1 : 파일 1 원칙)에 따라
 * 아래 개별 파일로 이전되었습니다. 이 파일을 수정하지 말고 아래 경로를 사용하세요.
 *
 * 이전 대상:
 * - test/b_pages/landing/LandingPage.test.tsx     ← 통합 스모크 (콘텐츠 4섹션)
 * - test/b_pages/landing/sections/HeroSection.test.tsx
 * - test/b_pages/landing/sections/MatchStripSection.test.tsx
 * - test/b_pages/landing/sections/CategoryCardsSection.test.tsx
 * - test/b_pages/landing/sections/SquadPreviewSection.test.tsx
 * - test/c_widgets/Navbar/Navbar.test.tsx          ← Navbar 위젯 (nav 시맨틱)
 * - test/c_widgets/Footer/MainFooter.test.tsx      ← Footer 위젯 (footer 시맨틱)
 *
 * ⚠️ 아키텍처 정정: LandingPage = <main> + 4섹션만.
 *    Nav/Footer는 app/layout 전역 소관 — LandingPage 스모크에서 기대 금지.
 */
