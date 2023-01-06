import React, { useCallback } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

import { Button } from '~/components/common'
import { useCurrentTheme, useTheme } from '~/hooks/useTheme'

export const ThemeChanger = () => {
  const [theme, setTheme] = useTheme()
  const currentTheme = useCurrentTheme()

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
    <Button forIcon onClick={toggleTheme} aria-label="테마 변경">
      {currentTheme === 'dark' ? (
        <SunIcon width={18} height={18} />
      ) : (
        <MoonIcon width={18} height={18} />
      )}
    </Button>
  )
}
