export type Type = 'String' | 'Number' | 'Nested';

export interface Field {
  id: string;
  key: string;
  type: Type;
  fields?: Field[];
}
