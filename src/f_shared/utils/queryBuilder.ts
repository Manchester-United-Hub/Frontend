const buildQuery = (params: Record<string, unknown>) => {
  const _baseQueryString: string = '?';
  let _queryString: string = '';

  if (Object.keys(params).length === 0) return '';

  _queryString = Object.entries(params).reduce((queryStr, [k, v], idx) => {
    if (idx > 0) {
      queryStr += '&';
    }
    return queryStr + `${k}=${v}`;
  }, _baseQueryString);

  return encodeURI(_queryString);
};

export { buildQuery };
