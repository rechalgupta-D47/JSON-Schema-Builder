// File replaced by Builder.tsx. No longer needed.
// This file has been removed as part of the migration.
// Please refer to Builder.tsx for the updated implementation.
import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import SchemaRow from './SchemaRow';

interface SchemaBuilderProps {
  nestIndex: string;
}

const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ nestIndex }) => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: nestIndex,
  });

  const getFields = () => getValues(nestIndex);

  // Drag reorder handler using useFieldArray's move
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index !== destination.index) {
      move(source.index, destination.index);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        {fields.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No fields defined. Add one below."
            className="schema-card"
          />
        ) : (
          <Droppable droppableId={nestIndex}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={dragProvided.draggableProps.style}
                      >
                        <SchemaRow
                          nestIndex={nestIndex}
                          index={index}
                          onRemove={remove}
                          getFields={getFields}
                          dragHandleProps={dragProvided.dragHandleProps ?? undefined}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        <Button
          type="dashed"
          onClick={() => append({ key: '', type: 'String', fields: [], id: `field_${Date.now()}` })}
          icon={<PlusOutlined />}
          className="add-field-btn"
        >
          Add Field
        </Button>
      </div>
    </DragDropContext>
  );
};

export default SchemaBuilder;