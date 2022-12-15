export const parseJWT = <T>(token: string | null) => {
  if (typeof token !== 'string') return null

  const splited = token.split('.')
  if (splited.length < 3) return null

  try {
    const str = Buffer.from(splited[1], 'base64').toString()
    const parsed = JSON.parse(str)
    return parsed as T & { exp: number }
  } catch (e) {
    return null
  }
}
