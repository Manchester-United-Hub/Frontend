'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@shared/ui';
import { cn } from '@shared/utils';
import { EndpointDef } from '../model';
import { buildUrlWithParamsAndQueries } from '../utils';

type QueryState = { url: string; trigger: number };

interface EndpointPanelProps {
  endpoint: EndpointDef;
}

function EndpointPanel({ endpoint }: EndpointPanelProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      endpoint.fields.map((f) => [f.name, f.defaultValue ?? ''])
    )
  );
  const [queryState, setQueryState] = useState<QueryState | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ['api-test', queryState?.url, queryState?.trigger],
    queryFn: async () => {
      const res = await fetch(queryState!.url);
      const body = await res.json();
      return { status: res.status, ok: res.ok, body };
    },
    enabled: !!queryState,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  const previewUrl = buildUrlWithParamsAndQueries(endpoint, values);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setQueryState((prev) => ({
      url: previewUrl,
      trigger: (prev?.trigger ?? 0) + 1,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 font-mono text-sm text-gray-600 break-all">
        <span className="text-blue-600 font-semibold mr-2">GET</span>
        {previewUrl}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {endpoint.fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
              <span className="text-xs text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                {field.paramType}
              </span>
            </label>
            <input
              type="text"
              inputMode={field.type === 'number' ? 'numeric' : 'text'}
              value={values[field.name]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              placeholder={field.placeholder}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
        {endpoint.fields.length === 0 && (
          <p className="text-sm text-gray-400 italic">파라미터 없음</p>
        )}
        <Button
          mode="submit"
          disabled={isFetching}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isFetching ? '요청 중...' : 'Request'}
        </Button>
      </form>

      {isFetching && (
        <div className="animate-pulse space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <div className="h-5 bg-gray-200 rounded w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-10" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-3.5 bg-gray-200 rounded"
              style={{ width: `${60 + (i % 3) * 15}%` }}
            />
          ))}
        </div>
      )}

      {data && !isFetching && (
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Response
            </span>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-mono font-semibold',
                data.ok
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              )}
            >
              {data.status}
            </span>
          </div>
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96 font-mono leading-relaxed whitespace-pre-wrap wrap-break-word">
            {JSON.stringify(data.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export { EndpointPanel, type QueryState };
