'use client';

import { Shell } from '@shared/ui';

import { useHighlights } from './model';
import { HighlightsContent, HighlightsHeadSection } from './ui';

interface HighlightsPageProps {
  season: number;
  showFeatured?: boolean;
}

function HighlightsPage({ season, showFeatured = true }: HighlightsPageProps) {
  const highlights = useHighlights({ season, showFeatured });

  return (
    <main>
      <HighlightsHeadSection />
      <Shell className="pt-6 pb-12">
        <HighlightsContent {...highlights} showFeatured={showFeatured} />
      </Shell>
    </main>
  );
}

export { HighlightsPage };
export type { HighlightsPageProps };
