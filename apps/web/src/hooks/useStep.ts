import { useState } from 'react'

export const useStep = (count: number) => {
  const [step, setStep] = useState(1)
  const next = () =>
    setStep((step) => {
      if (step < count) return step + 1
      return step
    })
  const prev = () =>
    setStep((step) => {
      if (step > 1) return step - 1
      return step
    })

  const prevStepAble = step > 1
  const nextStepAble = step < count

  return { step, handleStep: { next, prev }, stepAble: { prev: prevStepAble, next: nextStepAble } }
}
