import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'

type TypeText = 'number' | 'boolean' | 'string'
type TypeByString<T extends TypeText> = T extends 'number'
  ? number
  : T extends 'boolean'
  ? boolean
  : string

type TypeByString2<T extends TypeText, Nullable extends boolean> = Nullable extends true
  ? TypeByString<T> | null
  : TypeByString<T>

export const useQueryState = <T extends TypeText, Nullable extends boolean = false>({
  name,
  type,
  defaultValue,
}: {
  name: string
  type: T
  defaultValue: TypeByString2<T, Nullable>
  nullable?: Nullable
}) => {
  const router = useRouter()

  const setQuery = useCallback(
    (value: TypeByString2<T, Nullable>) => {
      const query = router.query

      if (value === defaultValue) {
        delete query[name]
      } else {
        if (value === null) {
          delete query[name]
        } else if (type === 'number') {
          query[name] = value.toString()
        } else if (type === 'boolean') {
          query[name] = value ? '1' : '0'
        } else if (type === 'string') {
          query[name] = value as string
        }
      }

      router.push({ pathname: router.pathname, query }, undefined, {
        shallow: true,
      })
    },
    [router, defaultValue, name, type],
  )

  const value: TypeByString2<T, Nullable> = useMemo(() => {
    const query = router.query[name]

    if (typeof query !== 'string') {
      return defaultValue
    }

    if (type === 'number' && !isNaN(query as any)) {
      return parseInt(query) as TypeByString<T>
    } else if (type === 'boolean') {
      return (query === '1' ? true : false) as TypeByString<T>
    } else if (type === 'string') {
      return query as TypeByString<T>
    }

    return defaultValue
  }, [defaultValue, name, router.query, type])

  return [value, setQuery] as [typeof value, typeof setQuery]
}
