import { useEffect, useState } from 'react'

export const useRandomArray = <T>(items: T[], count: number) => {
  const [array, setArray] = useState<T[]>([])

  useEffect(() => {
    const list: T[] = []
    const length = items.length
    for (let i = 0; i < count; i++) {
      list.push(items[Math.floor(Math.random() * length)])
    }
    setArray(list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return array
}
