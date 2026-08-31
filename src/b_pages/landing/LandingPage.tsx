import { heroContent, nextMatch, recentMatch, categories } from './model/mockData';
import {
  CategoryCardsSection,
  HeroSection,
  MatchStripSection,
  SquadPreviewContainer,
} from './ui';

interface LandingPageProps {
  season: number;
}

export function LandingPage({ season }: LandingPageProps) {
  return (
    <>
      <main>
        <HeroSection content={heroContent} nextMatch={nextMatch} />
        <MatchStripSection status="ready" recent={recentMatch} next={nextMatch} />
        <CategoryCardsSection categories={categories} />
        <SquadPreviewContainer season={season} />
      </main>
    </>
  );
}
