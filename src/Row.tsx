import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input, Select, Button, Space, Tooltip } from 'antd';
import { CloseOutlined, HolderOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import Builder from './Builder';

const { Option } = Select;

interface Props {
  idx: string;
  i: number;
  onDel: (i: number) => void;
  getList: () => any[];
  dragProps?: React.HTMLAttributes<HTMLDivElement>;
}

const Row: React.FC<Props> = ({ idx, i, onDel, getList, dragProps }) => {
  const { control, watch, formState: { errors } } = useFormContext();
  const name = `${idx}.${i}`;
  const field = watch(name);
  const [collapsed, setCollapsed] = useState(false);
  const err = (errors[idx] as any)?.[i];

  return (
    <div className="schema-row">
      <Space align="start">
        <Tooltip title="Drag to reorder">
          <div {...dragProps} className="drag-handle" style={{ paddingTop: '5px' }}>
            <HolderOutlined />
          </div>
        </Tooltip>
        <div style={{ flex: 1 }}>
          <Space wrap>
            <Controller
              control={control}
              name={`${name}.key`}
              rules={{
                required: 'Key is required',
                validate: (v) => getList().filter((f) => f.key === v).length <= 1 || 'Key must be unique',
              }}
              render={({ field }) => (
                <Input {...field} placeholder="Field Name" status={err?.key ? 'error' : ''} />
              )}
            />
            <Controller
              control={control}
              name={`${name}.type`}
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
                name={`${name}.arrayType`}
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
              <Button icon={<CloseOutlined />} onClick={() => onDel(i)} danger />
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
          {err?.key && <div className="error-text">{err.key.message}</div>}
          {!collapsed && (field.type === 'Nested' || (field.type === 'Array' && field.arrayType === 'Nested')) && (
            <div style={{ marginLeft: '30px', marginTop: '10px', borderLeft: '2px solid #d9d9d9', paddingLeft: '15px' }}>
              <Builder idx={`${name}.fields`} />
            </div>
          )}
        </div>
      </Space>
    </div>
  );
};

export default Row;
