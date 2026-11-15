import { Shell } from '@shared/ui';

import type { LiveMatch } from './model';
import { ClosedView, LiveScoreboard } from './ui';

const PAGE_HEADING = '라이브 경기';

interface LivePageProps {
  match: LiveMatch;
}

function LivePage({ match }: LivePageProps) {
  if (match.status === 'closed') {
    return <ClosedView />;
  }

  return (
    <main>
      <Shell className="py-10 max-[620px]:py-6">
        <h1 className="sr-only">{PAGE_HEADING}</h1>
        <LiveScoreboard match={match} />
      </Shell>
    </main>
  );
}

export { LivePage, type LivePageProps };
