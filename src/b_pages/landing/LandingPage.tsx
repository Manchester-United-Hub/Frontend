import { heroContent } from './model/configs';
import {
  CategoryCardsSection,
  FeaturedMatchContainer,
  HeroSection,
  MatchStripContainer,
  SquadPreviewContainer,
} from './ui';

interface LandingPageProps {
  season: number;
}

export function LandingPage({ season }: LandingPageProps) {
  return (
    <>
      <main>
        <HeroSection
          content={heroContent}
          matchPanel={<FeaturedMatchContainer />}
        />
        <MatchStripContainer />
        <SquadPreviewContainer season={season} />
        <CategoryCardsSection />
      </main>
    </>
  );
}
