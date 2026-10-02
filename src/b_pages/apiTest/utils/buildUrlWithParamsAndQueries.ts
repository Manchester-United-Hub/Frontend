import { EndpointDef } from '../model';

function buildUrlWithParamsAndQueries(
  endpoint: EndpointDef,
  values: Record<string, string>
): string {
  const splitIndex = endpoint.path.indexOf('?');

  const basePath =
    splitIndex >= 0 ? endpoint.path.slice(0, splitIndex) : endpoint.path;
  const existingQuery =
    splitIndex >= 0 ? endpoint.path.slice(splitIndex + 1) : '';
  const queryParams = new URLSearchParams(existingQuery);
  let resolvedPath = basePath;

  for (const field of endpoint.fields) {
    const val = values[field.name];
    if (!val) continue;
    if (field.paramType === 'path') {
      resolvedPath = resolvedPath.replace(
        `{${field.name}}`,
        encodeURIComponent(val)
      );
    } else {
      queryParams.set(field.name, val);
    }
  }

  const qs = queryParams.toString();
  return `${resolvedPath}${qs ? `?${qs}` : ''}`;
}

export { buildUrlWithParamsAndQueries };
