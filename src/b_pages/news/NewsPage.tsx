import { Shell } from '@shared/ui';

import { NewsContent, NewsHeadSection } from './ui';

function NewsPage() {
  return (
    <main>
      <NewsHeadSection />
      <Shell className="pt-6 pb-12">
        <NewsContent />
      </Shell>
    </main>
  );
}

export { NewsPage };
