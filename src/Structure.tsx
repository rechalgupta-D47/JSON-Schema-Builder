import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import FieldEditor from './FieldEditor';

interface StructureProps {
  path: string;
}

const Structure: React.FC<StructureProps> = ({ path }) => {
  const { control, getValues } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: path,
  });


  // Get fields for validation in FieldEditor
  const getFields = () => getValues(path);


  // Handle drag and drop for reordering fields
  const handleDrag = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index !== destination.index) move(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <div>
        {fields.length > 0 && (
          <Droppable droppableId={path}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        style={dragProvided.draggableProps.style}
                      >
                        <FieldEditor
                          path={path}
                          idx={idx}
                          onRemove={remove}
                          getFields={getFields}
                          dragHandle={dragProvided.dragHandleProps ?? undefined}
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

export default Structure;
