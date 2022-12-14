import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const tokenAtom = atomWithStorage<null | string>('auth-token', null)

export const tokenDataAtom = atom((get) => {
  const token = get(tokenAtom)
  if (!token) return null

  var splited = token.split('.')
  if (splited.length < 3) return null

  try {
    const parsed = JSON.parse(Buffer.from(splited[1], 'base64').toString('base64'))
    return parsed as {}
  } catch (e) {
    return null
  }
})
