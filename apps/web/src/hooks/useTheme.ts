import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const themeDataAtom = atomWithStorage<Theme>('theme', 'system')

export const themeAtom = atom<Theme, Theme>(
  (get) => get(themeDataAtom),
  (get, set, update) => {
    if (globalThis.localStorage) {
      if (update === 'system') {
        if (
          typeof globalThis !== 'undefined' &&
          globalThis.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          globalThis.document.documentElement.classList.add('dark')
        } else {
          globalThis.document.documentElement.classList.remove('dark')
        }
      } else if (update === 'light') {
        globalThis.document.documentElement.classList.remove('dark')
      } else if (update === 'dark') {
        globalThis.document.documentElement.classList.add('dark')
      }
    }
    set(themeDataAtom, update)
  },
)

export const useTheme = () => useAtom(themeAtom)

export const useCurrentTheme = () => {
  const [theme] = useTheme()
  const currentTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof globalThis.matchMedia !== 'function') return 'light'
      if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
      return 'light'
    }
    return theme
  }, [theme])

  return currentTheme
}
