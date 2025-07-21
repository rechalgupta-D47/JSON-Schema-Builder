export type FieldType = 'String' | 'Number' | 'Boolean' | 'Nested' | 'Array';
export type ArrayElement = 'String' | 'Number' | 'Boolean' | 'Nested';

export interface SchemaField {
  id: string; // react-hook-form uses this
  key: string;
  type: FieldType;
  arrayType?: ArrayElement; // For type 'Array'
  fields?: SchemaField[];   // For type 'Nested' or 'Array' of 'Nested'
}