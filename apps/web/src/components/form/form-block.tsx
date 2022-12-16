import { ReactNode } from 'react'
import classNames from 'classnames'

export interface FormBlockProps {
  label?: string
  description?: string
  error?: string
  children?: ReactNode
  required?: boolean
  name?: string
  customLabel?: any
  labelRight?: JSX.Element
}

export const FormBlock = ({
  label,
  description,
  children,
  error,
  customLabel: CustomLabel,
  required,
  name,
  labelRight,
}: FormBlockProps) => {
  if (!label) return <>{children}</>
  return (
    <div>
      <div className="flex justify-between">
        <>
          {CustomLabel ? (
            <CustomLabel htmlFor={name} className="text-title-color">
              {label}
            </CustomLabel>
          ) : (
            <label htmlFor={name} className="text-title-color">
              {label}
            </label>
          )}
          <div className="text-subtitle-color">{labelRight}</div>
        </>
      </div>
      {description && <div className="text-sm text-description-color">{description}</div>}
      <div className={classNames('mt-1.5 mx-0.5 flex flex-col gap-1', error && 'mb-1')}>
        {children}
      </div>
      {error && <div className="text-error-color text-sm">{error}</div>}
    </div>
  )
}

export const formBlockPropsRemover = <T,>(props: T & Partial<FormBlockProps>) => {
  const {
    label: _label,
    required: _required,
    error: _error,
    children: _children,
    customLabel: _customLabel,
    ...otherProps
  } = props
  return otherProps
}
