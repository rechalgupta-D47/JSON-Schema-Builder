import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Row from './Row';

interface Props {
  idx: string;
}

const Builder: React.FC<Props> = ({ idx }) => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: idx,
  });

  const getList = () => getValues(idx);

  const onDrag = (res: DropResult) => {
    const { source, destination } = res;
    if (!destination) return;
    if (source.index !== destination.index) move(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={onDrag}>
      <div>
        {fields.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No fields defined. Add one below."
            className="schema-card"
          />
        ) : (
          <Droppable droppableId={idx}>
            {(prov) => (
              <div {...prov.droppableProps} ref={prov.innerRef}>
                {fields.map((item, i) => (
                  <Draggable key={item.id} draggableId={item.id} index={i}>
                    {(dragProv) => (
                      <div
                        ref={dragProv.innerRef}
                        {...dragProv.draggableProps}
                        style={dragProv.draggableProps.style}
                      >
                        <Row
                          idx={idx}
                          i={i}
                          onDel={remove}
                          getList={getList}
                          dragProps={dragProv.dragHandleProps ?? undefined}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {prov.placeholder}
              </div>
            )}
          </Droppable>
        )}
        <Button
          type="dashed"
          onClick={() => append({ key: '', type: 'String', fields: [], id: `f_${Date.now()}` })}
          icon={<PlusOutlined />}
          className="add-field-btn"
        >
          Add Field
        </Button>
      </div>
    </DragDropContext>
  );
};

export default Builder;
