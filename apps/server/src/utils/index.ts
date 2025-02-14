import { readdirSync, statSync } from 'fs'

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

// https://gist.github.com/kethinov/6658166
export const readAllFiles = (dirPath: string, fileList: string[] = []) => {
  const files = readdirSync(dirPath)
  for (const file of files) {
    const filePath = dirPath + '/' + file
    const stat = statSync(filePath)

    if (stat.isFile()) fileList.push(filePath)
    else fileList = readAllFiles(filePath, fileList)
  }

  return fileList
}
