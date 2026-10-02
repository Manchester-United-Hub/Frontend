type ParamType = 'path' | 'query';

type FieldDef = {
  name: string;
  label: string;
  type: 'text' | 'number';
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  paramType: ParamType;
};

type EndpointDef = {
  name: string;
  path: string;
  fields: FieldDef[];
};

type CategoryDef = {
  name: string;
  endpoints: EndpointDef[];
};

export type { CategoryDef, EndpointDef, FieldDef, ParamType };
