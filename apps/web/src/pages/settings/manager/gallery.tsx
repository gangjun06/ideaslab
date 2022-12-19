import type { NextPage } from 'next'
import { SettingLayout } from '~/layouts'
import { useUser } from '~/hooks/useAuth'
import { Form, Input } from '~/components/form'
import { useForm } from '~/hooks/useForm'
import { adminGallerySettingValidator, authSignUpValidator, z } from '@ideaslab/validator'
import { trpc } from '~/lib/trpc'
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import classNames from 'classnames'
import { Button, GripVerticalIcon } from '~/components/common'
import { TrashIcon } from '@heroicons/react/24/outline'
import { FormBlock } from '~/components/form/form-block'
import { ChannelSelector } from '~/components/channel-selector'

const GallerySetting: NextPage = () => {
  const profile = useUser()
  const gallerySetting = trpc.admin.gallerySetting.useMutation()
  const form = useForm(adminGallerySettingValidator, {
    onSubmit: async (data) => {},
  })

  const {
    control,
    registerForm,
    formState: { errors },
  } = form

  return (
    <SettingLayout title="갤러리 설정" guard="adminOnly">
      <Form form={form} className="pt-4 md:pt-0 md:col-span-9 flex flex-col gap-y-4">
        <FieldArray
          control={control}
          register={registerForm}
          error={errors.categories?.message ?? ''}
        />
      </Form>
    </SettingLayout>
  )
}

const FieldArray = ({
  control,
  register,
  error,
}: {
  control: Control<z.TypeOf<typeof adminGallerySettingValidator>>
  register: UseFormRegister<z.TypeOf<typeof adminGallerySettingValidator>>
  error: string
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'categories',
  })

  const items = fields.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={classNames('flex items-center card px-2 py-2 mb-2', {
            'shadow-lg': snapshot.isDragging,
          })}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-center h-full px-2"
          >
            <GripVerticalIcon width={18} height={18} />
          </div>
          <div className="flex w-full justify-between gap-x-2 pr-2">
            <ChannelSelector />
            <Input
              labelClassName="w-full"
              className="w-full"
              placeholder="카테고리 이름"
              {...register(`categories.${index}.channel`)}
            />
          </div>
          <Button variant="subtle" className="mr-2" forIcon onClick={() => remove(index)}>
            <TrashIcon width={18} height={18} />
          </Button>
        </div>
      )}
    </Draggable>
  ))

  return (
    <FormBlock
      label="카테고리 설정"
      description="갤러리 카테고리를 설정하세요."
      right={
        <Button variant="primary" onClick={() => append({ name: '', channel: '', order: 0 })}>
          추가
        </Button>
      }
      error={error}
    >
      <DragDropContext
        onDragEnd={({ source, destination }) => move(source.index, destination?.index || 0)}
      >
        <Droppable droppableId="list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </FormBlock>
  )
}

export default GallerySetting
