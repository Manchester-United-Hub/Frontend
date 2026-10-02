import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

import { CATEGORIES } from './model';
import { EndpointPanel } from './ui';

function ApiTest() {
  return (
    <div className="max-w-full min-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">API Test</h1>
      <TabGroup>
        <TabList className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {CATEGORIES.map((cat) => (
            <Tab
              key={cat.name}
              className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 data-selected:bg-white data-selected:text-gray-900 data-selected:shadow-sm"
            >
              {cat.name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-4">
          {CATEGORIES.map((cat) => (
            <TabPanel key={cat.name}>
              {cat.endpoints.length === 1 ? (
                <EndpointPanel endpoint={cat.endpoints[0]} />
              ) : (
                <TabGroup>
                  <TabList className="flex border-b border-gray-200 mb-4">
                    {cat.endpoints.map((ep) => (
                      <Tab
                        key={ep.name}
                        className="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors text-gray-500 hover:text-gray-700 border-transparent data-selected:border-blue-500 data-selected:text-blue-600"
                      >
                        {ep.name}
                      </Tab>
                    ))}
                  </TabList>
                  <TabPanels>
                    {cat.endpoints.map((ep) => (
                      <TabPanel key={ep.name}>
                        <EndpointPanel endpoint={ep} />
                      </TabPanel>
                    ))}
                  </TabPanels>
                </TabGroup>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}

export { ApiTest };
