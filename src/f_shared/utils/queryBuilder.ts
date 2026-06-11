type QueryParams = Record<string, unknown> | Iterable<[string, unknown]>;

const buildQuery = (params: QueryParams): string => {
  const entries: [string, unknown][] =
    Symbol.iterator in params
      ? [...(params as Iterable<[string, unknown]>)]
      : Object.entries(params);

  if (entries.length === 0) return '';

  const searchParams = new URLSearchParams(
    entries
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  );

  return '?' + searchParams.toString();
};

export { buildQuery };
