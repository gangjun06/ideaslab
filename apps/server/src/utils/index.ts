export const ignoreError = async (func: Promise<any> | (() => Promise<any>)) => {
  try {
    if (typeof func === 'function') {
      await func()
      return
    }
    await func
  } catch {
    /* empty */
  }
}
