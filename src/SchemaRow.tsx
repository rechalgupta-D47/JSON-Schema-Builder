// File replaced by Row.tsx. No longer needed.
// This file has been removed as part of the migration.
// Please refer to Row.tsx for the updated implementation.
import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Button, Space, Tooltip } from 'antd';
import { CloseOutlined, HolderOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import SchemaBuilder from './SchemaBuilder';

const { Option } = Select;

interface SchemaRowProps {
  nestIndex: string;
  index: number;
  onRemove: (index: number) => void;
  getFields: () => any[];
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const SchemaRow: React.FC<SchemaRowProps> = ({ nestIndex, index, onRemove, getFields, dragHandleProps }) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const fieldName = `${nestIndex}.${index}`;
  const field = watch(fieldName);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Find errors for the current field
  const fieldErrors = (errors[nestIndex] as any)?.[index];

  return (
    <div className="schema-row">

      <Space align="start">
        <Tooltip title="Drag to reorder">
          <div {...dragHandleProps} className="drag-handle" style={{ paddingTop: '5px' }}>
            <HolderOutlined />
          </div>
        </Tooltip>

        <div style={{ flex: 1 }}>
          <Space wrap>
            <Controller
              control={control}
              name={`${fieldName}.key`}
              rules={{
                required: 'Key is required',
                validate: (value) =>
                  getFields().filter((f) => f.key === value).length <= 1 || 'Key must be unique',
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Field Name" status={fieldErrors?.key ? 'error' : ''} />
              )}
            />
            <Controller
              control={control}
              name={`${fieldName}.type`}
              defaultValue="String"
              render={({ field }) => (
                <Select {...field} style={{ width: 120 }}>
                  <Option value="String">String</Option>
                  <Option value="Number">Number</Option>
                  <Option value="Boolean">Boolean</Option>
                  <Option value="Nested">Nested</Option>
                  <Option value="Array">Array</Option>
                </Select>
              )}
            />
            {field.type === 'Array' && (
              <Controller
                control={control}
                name={`${fieldName}.arrayType`}
                defaultValue="String"
                render={({ field: arrayField }) => (
                  <Select {...arrayField} style={{ width: 150 }}>
                    <Option value="String">of Strings</Option>
                    <Option value="Number">of Numbers</Option>
                    <Option value="Boolean">of Booleans</Option>
                    <Option value="Nested">of Nested Objects</Option>
                  </Select>
                )}
              />
            )}
            <Tooltip title="Delete field">
              <Button icon={<CloseOutlined />} onClick={() => onRemove(index)} danger />
            </Tooltip>
            {(field.type === 'Nested' || (field.type === 'Array' && field.arrayType === 'Nested')) && (
              <Tooltip title={isCollapsed ? 'Expand' : 'Collapse'}>
                <Button
                  icon={isCollapsed ? <CaretRightOutlined /> : <CaretDownOutlined />}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                />
              </Tooltip>
            )}
          </Space>
          {fieldErrors?.key && <div className="error-text">{fieldErrors.key.message}</div>}
          
          {!isCollapsed && (field.type === 'Nested' || (field.type === 'Array' && field.arrayType === 'Nested')) && (
            <div style={{ marginLeft: '30px', marginTop: '10px', borderLeft: '2px solid #d9d9d9', paddingLeft: '15px' }}>
              <SchemaBuilder nestIndex={`${fieldName}.fields`} />
            </div>
          )}
        </div>
      </Space>
    </div>
  );
};

export default SchemaRow;