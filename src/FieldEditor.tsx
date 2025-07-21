import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Button, Space, Tooltip } from 'antd';
import { CloseOutlined, HolderOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import Structure from './Structure';

const { Option } = Select;

interface FieldEditorProps {
  path: string;
  idx: number;
  onRemove: (idx: number) => void;
  getFields: () => any[];
  dragHandle?: React.HTMLAttributes<HTMLDivElement>;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ path, idx, onRemove, getFields, dragHandle }) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const fieldPath = `${path}.${idx}`;
  const field = watch(fieldPath);
  const [collapsed, setCollapsed] = useState(false);
  const error = (errors[path] as any)?.[idx];

  return (
    <div className="schema-row">
      <Space align="start">
        <Tooltip title="Drag to reorder">
          <div {...dragHandle} className="drag-handle" style={{ paddingTop: '5px' }}>
            <HolderOutlined />
          </div>
        </Tooltip>
        <div style={{ flex: 1 }}>
          <Space wrap>
            <Controller
              control={control}
              name={`${fieldPath}.key`}
              rules={{
                required: 'Key is required',
                validate: (v) => getFields().filter((f) => f.key === v).length <= 1 || 'Key must be unique',
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Field Name" status={error?.key ? 'error' : ''} />
              )}
            />
            <Controller
              control={control}
              name={`${fieldPath}.type`}
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
                name={`${fieldPath}.arrayType`}
                defaultValue="String"
                render={({ field: arrField }) => (
                  <Select {...arrField} style={{ width: 150 }}>
                    <Option value="String">of Strings</Option>
                    <Option value="Number">of Numbers</Option>
                    <Option value="Boolean">of Booleans</Option>
                    <Option value="Nested">of Nested Objects</Option>
                  </Select>
                )}
              />
            )}
            <Tooltip title="Delete field">
              <Button icon={<CloseOutlined />} onClick={() => onRemove(idx)} danger />
            </Tooltip>
            {(field.type === 'Nested' || (field.type === 'Array' && field.arrayType === 'Nested')) && (
              <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
                <Button
                  icon={collapsed ? <CaretRightOutlined /> : <CaretDownOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                />
              </Tooltip>
            )}
          </Space>
          {error?.key && <div className="error-text">{error.key.message}</div>}
          {!collapsed && (field.type === 'Nested' || (field.type === 'Array' && field.arrayType === 'Nested')) && (
            <div style={{ marginLeft: '30px', marginTop: '10px', borderLeft: '2px solid #d9d9d9', paddingLeft: '15px' }}>
              <Structure path={`${fieldPath}.fields`} />
            </div>
          )}
        </div>
      </Space>
    </div>
  );
};

export default FieldEditor;
