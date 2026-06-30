import { heroContent, nextMatch, recentMatch, categories, squadPlayers } from './model/mockData';
import {
  CategoryCardsSection,
  HeroSection,
  MatchStripSection,
  SquadPreviewSection,
} from './ui';

export function LandingPage() {
  return (
    <>
      <main>
        <HeroSection content={heroContent} nextMatch={nextMatch} />
        <MatchStripSection status="ready" recent={recentMatch} next={nextMatch} />
        <CategoryCardsSection categories={categories} />
        <SquadPreviewSection players={squadPlayers} />
      </main>
    </>
  );
}
