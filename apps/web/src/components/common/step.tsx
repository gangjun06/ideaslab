import classNames from 'classnames'

interface Props {
  currentStep: number
  list: string[]
  className: string
}

export const Step = ({ currentStep, list, className }: Props) => {
  return (
    <div className={classNames('space-y-2', className)}>
      <h3 className="text-base font-semibold">{list[currentStep - 1]}</h3>
      <div className="flex max-w-xs space-x-3">
        {list.map((_, index) => (
          <span
            key={index}
            className={classNames('w-12 h-2 rounded-sm ', {
              'bg-green-600 dark:bg-green-400': index + 1 < currentStep,
              'bg-gray-800 dark:bg-gray-100': index + 1 === currentStep,
              'bg-gray-400 dark:bg-gray-600': index + 1 > currentStep,
            })}
          />
        ))}
      </div>
    </div>
  )
}
