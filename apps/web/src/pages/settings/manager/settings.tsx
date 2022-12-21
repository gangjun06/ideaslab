import type { NextPage } from 'next'
import { SettingLayout } from '~/layouts'
import { useUser } from '~/hooks/useAuth'
import { Form, FormFieldBuilder, Input } from '~/components/form'
import { useForm } from '~/hooks/useForm'
import {
  adminGallerySettingValidator,
  adminSaveSettingsValidator,
  authSignUpValidator,
  z,
} from '@ideaslab/validator'
import { trpc } from '~/lib/trpc'
import { Control, useFieldArray, UseFormRegister } from 'react-hook-form'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import classNames from 'classnames'
import { Button, GripVerticalIcon } from '~/components/common'
import { TrashIcon } from '@heroicons/react/24/outline'
import { FormBlock } from '~/components/form/form-block'
import { ChannelSelector } from '~/components/channel-selector'
import { RoleSelector } from '~/components/role-selector'
import { toast } from 'react-hot-toast'
import { appRouter } from '~/../../server/src/router/_app'
import { useEffect, useMemo } from 'react'

const SettingsPage: NextPage = () => {
  const profile = useUser()
  const { data: settings } = trpc.admin.loadSettings.useQuery(undefined, { trpc: { ssr: false } })

  const saveSettings = trpc.admin.saveSettings.useMutation()
  const form = useForm(adminSaveSettingsValidator, {
    onSubmit: async (data) => {
      await saveSettings.mutateAsync(data)
      toast.success('저장')
    },
    onInvalid: (data) => {
      toast.error(JSON.stringify(data))
    },
    defaultValues: {
      settings:
        settings
          ?.filter((data) => data.value !== undefined && data.value !== null)
          .map(({ key, value }) => ({ key, value })) ?? [],
    },
  })

  const {
    control,
    registerForm,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = form

  return (
    <SettingLayout title="서비스 설정" guard="adminOnly">
      <Form form={form} className="pt-4 md:pt-0 md:col-span-9 flex flex-col gap-y-4">
        <FieldArray
          settings={settings ?? []}
          control={control}
          register={registerForm}
          error={errors.settings?.message ?? ''}
        />
        <div className="flex justify-end gap-x-2">
          <Button
            disabled={!isDirty}
            onClick={() => {
              reset()
            }}
          >
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={!isDirty} loading={isSubmitting}>
            저장
          </Button>
        </div>
      </Form>
    </SettingLayout>
  )
}

const FieldArray = ({
  control,
  register,
  error,
  settings,
}: {
  settings: typeof appRouter.admin.loadSettings['_def']['_output_out']
  control: Control<z.TypeOf<typeof adminSaveSettingsValidator>>
  register: UseFormRegister<z.TypeOf<typeof adminSaveSettingsValidator>>
  error: string
}) => {
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'settings',
  })

  const set = (key: string) => {
    append({ key, value: settingMap[key].value ?? '' })
  }

  const settingMap = useMemo(
    () =>
      settings.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.key]: cur,
        }),
        {} as Record<string, typeof settings[number]>,
      ),
    [settings],
  )

  const Item = ({
    field,
    index,
    disable = false,
    defaultValue,
  }: {
    defaultValue?: any
    field?: any
    index?: number
    disable?: boolean
  }) => {
    if (disable) {
      return <Input value={defaultValue} className="w-full mb-2" />
    }

    if (!field || index === undefined) return <></>

    switch (settingMap[field.key].type) {
      case 'channel':
        return (
          <FormFieldBuilder name={`settings.${index}.value`}>
            {({ field: { onChange, onBlur, value }, error }) => (
              <ChannelSelector error={error} onChange={onChange} onBlur={onBlur} value={value} />
            )}
          </FormFieldBuilder>
        )
      case 'role':
        return (
          <FormFieldBuilder name={`settings.${index}.value`}>
            {({ field: { onChange, onBlur, value }, error }) => (
              <RoleSelector error={error} onChange={onChange} onBlur={onBlur} value={value} />
            )}
          </FormFieldBuilder>
        )
      case 'tag':
        return <Input {...register(`settings.${index}.value`)} className="w-full" />
      case 'string':
        return <Input {...register(`settings.${index}.value`)} className="w-full" />
      default:
        return <></>
    }
  }

  return (
    <div className="divide-y-2">
      {fields.length > 0 && (
        <div className="mb-2 space-y-2">
          {fields.map((field, index) => (
            <FormBlock
              key={field.id}
              label={settingMap[field.key].key}
              description={settingMap[field.key].description}
            >
              <Item field={field} index={index} />
            </FormBlock>
          ))}
        </div>
      )}
      <div className="pt-2">
        {settings
          .filter((item) => fields.findIndex((field) => field.key === item.key) < 0)
          .map((item) => (
            <FormBlock
              label={item.key}
              description={item.description}
              key={item.key}
              right={
                <Button type="button" onClick={() => set(item.key)}>
                  설정
                </Button>
              }
            >
              {item.value && <Item defaultValue={item.value} disable />}
            </FormBlock>
          ))}
      </div>
    </div>
  )
}

export default SettingsPage
