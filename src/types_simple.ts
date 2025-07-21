export type Type = 'String' | 'Number' | 'Boolean' | 'Nested' | 'Array';
export type ArrType = 'String' | 'Number' | 'Boolean' | 'Nested';

export interface Field {
  id: string;
  key: string;
  type: Type;
  arrayType?: ArrType;
  fields?: Field[];
}
