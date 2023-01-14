import { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeepRequired, FieldErrorsImpl, useForm as useLibForm } from 'react-hook-form'
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegisterReturn,
} from 'react-hook-form'

import { z, ZodEffects, ZodNumber, ZodObject, ZodOptional, ZodString } from '@ideaslab/validator'

type UseFormRegisterOption<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = RegisterOptions<TFieldValues, TFieldName> &
  Partial<{
    customLabel?: string
  }>

export declare type UseFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  name: TFieldName,
  options?: UseFormRegisterOption<TFieldValues, TFieldName>,
) => UseFormRegisterReturn<TFieldName> & {
  error?: string
  required?: boolean
}

export const useForm = <TSchema extends z.ZodType<any, any, any>>(
  schema: TSchema,
  props?: Parameters<typeof useLibForm<z.TypeOf<TSchema>>>[0] & {
    isLoading?: boolean
    onSubmit?: SubmitHandler<z.TypeOf<TSchema>>
    onInvalid?: SubmitErrorHandler<z.TypeOf<TSchema>>
  },
) => {
  const form = useLibForm<z.infer<TSchema>>({
    ...props,
    resolver: zodResolver(schema),
    mode: props?.mode ?? 'onChange',
  })

  const { errors } = form.formState
  const registerFormValue = useCallback(
    (name: string, options: UseFormRegisterOption<z.infer<TSchema>, any>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const error: FieldErrorsImpl<DeepRequired<z.TypeOf<TSchema>>>[string] = name
        .split('.')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        .reduce((acc, cur) => (acc ? acc[isNaN(cur as any) ? cur : parseInt(cur)] : null), errors)
      return {
        required: !!options?.required,
        error: (error?.message as string) ?? '',
      }
    },
    [errors],
  )

  const registerForm: UseFormRegister<z.infer<TSchema>> = (name, options = {}) => {
    let target = schema?._def

    const inputProps: React.PropsWithoutRef<JSX.IntrinsicElements['input']> = {}

    if (schema instanceof ZodEffects && schema._def.schema instanceof ZodObject)
      target = schema._def.schema.shape[name]
    else if (schema instanceof ZodObject) target = schema.shape[name]
    else target = null

    if (target) {
      if (target instanceof ZodOptional) {
        target = target._def.innerType
      } else {
        options.required = true
      }
      if (target instanceof ZodNumber || target instanceof ZodString) {
        target._def.checks.forEach((data) => {
          if (data.kind === 'email') {
            inputProps.type = 'email'
          } else if (data.kind === 'max') {
            inputProps.max = data.value
            inputProps.maxLength = data.value
          }
        })
      }
    }

    inputProps.key = props?.isLoading ? `not-loaded-${name}` : `loaded-${name}`
    inputProps.disabled = props?.isLoading ? true : inputProps.disabled

    return {
      ...inputProps,
      ...form.register(name, options),
      ...registerFormValue(name, options as any),
    }
  }

  return { ...form, onSubmit: props?.onSubmit, registerForm, onInvalid: props?.onInvalid }
}
