import { Form } from "~/components/form";
import { SettingLayout } from "~/layouts";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Control, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import { GripVerticalIcon } from "~/components/common";

const ManagerCategotySettingPage = () => {
  return (
    <SettingLayout>
      <Form
        onSubmit={() => {
          console.log("onSubmit");
        }}
      >
        {({ control }) => (
          <>
            <FieldArray control={control} />
          </>
        )}
      </Form>
    </SettingLayout>
  );
};

const FieldArray = ({ control }: { control: Control<any> }) => {
  const { fields, append, move } = useFieldArray({
    control,
    name: "categories",
  });

  const items = fields.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={classNames(
            "flex items-center border border-gray-300 px-2 py-2 mb-2 shadow-sm",
            { "shadow-lg": snapshot.isDragging }
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-center h-full text-gray0700 px-4"
          >
            <GripVerticalIcon width={18} height={18} />
          </div>
          <div>
            <div>hello</div>
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ source, destination }) =>
        move(source.index, destination?.index || 0)
      }
    >
      <Droppable droppableId="list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div onClick={() => append(0)}>Add</div>
    </DragDropContext>
  );
};

export default ManagerCategotySettingPage;
