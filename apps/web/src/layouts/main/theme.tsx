import React, { ReactNode, useCallback, useMemo } from 'react'
import { Button } from '~/components/common'
import { useTheme } from '~/hooks/useTheme'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export const ThemeChanger = () => {
  const [theme, setTheme] = useTheme()
  const currentTheme = useMemo(() => {
    if (theme === 'system') {
      if (typeof globalThis.matchMedia !== 'function') return 'light'
      if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
      return 'light'
    }
    return theme
  }, [theme])

  const toggleTheme = useCallback(() => {
    if (theme !== 'system') {
      setTheme(theme === 'dark' ? 'light' : 'dark')
      return
    }

    if (typeof globalThis.matchMedia !== 'function') return 'light'
    if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('light')
      return
    }

    setTheme('dark')
  }, [setTheme, theme])
  return (
    <Button forIcon onClick={toggleTheme}>
      {currentTheme === 'dark' ? (
        <SunIcon width={18} height={18} />
      ) : (
        <MoonIcon width={18} height={18} />
      )}
    </Button>
  )
}
