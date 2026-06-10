type QueryParams = Record<string, unknown> | Iterable<[string, unknown]>;

const buildQuery = (params: QueryParams): string => {
  const entries: [string, unknown][] =
    Symbol.iterator in params
      ? [...(params as Iterable<[string, unknown]>)]
      : Object.entries(params);

  if (entries.length === 0) return '';

  const queryStr = entries.reduce((qs, [k, v], idx) => {
    if (idx > 0) qs += '&';
    return qs + `${k}=${v}`;
  }, '?');

  return encodeURI(queryStr);
};

export { buildQuery };
