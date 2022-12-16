import { useForm as useLibForm } from 'react-hook-form'

export const useForm = () => {
  const form = useLibForm()

  return { ...form }
}
