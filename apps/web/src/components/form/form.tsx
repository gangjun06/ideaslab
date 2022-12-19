import { ComponentProps, JSXElementConstructor, ReactElement, ReactNode } from 'react'
import {
  Controller,
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from 'react-hook-form'
import { z } from '@ideaslab/validator'
import { useForm } from '~/hooks/useForm'

export const Form = <TSchema extends z.ZodType<any, any, any>>({
  form,
  children,
  className,
  onSubmit = () => {},
  onInvalid = () => {},
}: {
  form: ReturnType<typeof useForm<TSchema>>
  children: ReactNode
  className?: string
  onSubmit?: SubmitHandler<z.TypeOf<TSchema>>
  onInvalid?: SubmitErrorHandler<z.TypeOf<TSchema>>
}) => {
  return (
    <FormProvider {...form}>
      <form
        className={className}
        onSubmit={form.handleSubmit(form.onSubmit ?? onSubmit, form.onInvalid ?? onInvalid)}
      >
        {children}
      </form>
    </FormProvider>
  )
}

export type ControllerRender = Parameters<ComponentProps<typeof Controller>['render']>[0]

export type FormFieldProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  ComponentProps<T> & {
    name: string
  }

interface FormFieldBuilderProps {
  name: string
  children: (data: ControllerRender & { error?: string }) => ReactElement
}

export const FormFieldBuilder = ({ name, children }: FormFieldBuilderProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => <>{children({ ...props, error: errors[name]?.message as string })}</>}
    />
  )
}
