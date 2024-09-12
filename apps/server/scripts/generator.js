/* eslint-disable @typescript-eslint/no-var-requires */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const cwd = process.cwd()

const config = {
  resultPath: './src/_generated',
  eventPath: './src/bot/events',
  eventPathAbsolute: '~/bot/events',
  interactionPath: './src/bot/interactions',
  interactionPathAbsolute: '~/bot/interactions',
  commandPath: './src/bot/commands',
  commandPathAbsolute: '~/bot/commands',
}

const prefix = `/* eslint-disable */\n`

/**
 * @param {string} str
 */
const removeExtension = (str) => str.replace(/\.[a-z-_]+$/, '')

/**
 * @param {string} str
 */
const snakeToCamel = (str) =>
  str.replace(/([-][a-z])/g, (group) => group.toUpperCase().replace(/^-/, ''))

// -----------------------------

if (!existsSync(join(cwd, config.resultPath))) {
  mkdirSync(join(cwd, config.resultPath))
}

// -----------------------------

const eventsPath = readdirSync(join(cwd, config.eventPath))
const events = eventsPath.map((filename) => removeExtension(filename))

const eventText = `${prefix}
import { Event } from '~/bot/base/event'

${events
  .map((filename) => `import ${filename} from '${config.eventPathAbsolute}/${filename}'`)
  .join('\n')}

export const events: Event<any>[] = [
  ${events.join(',\n  ')}
]
`

writeFileSync(join(cwd, config.resultPath, 'events.ts'), eventText)

// ------

const commandsFolderPath = readdirSync(join(cwd, config.commandPath))
const commands = []

for (const item of commandsFolderPath) {
  commands.push(
    ...readdirSync(join(cwd, config.commandPath, item)).map((filename) => ({
      folder: item,
      filename: removeExtension(filename),
      filenameCamel: snakeToCamel(`${item}-${removeExtension(filename)}`),
    })),
  )
}

const commandsText = `${prefix}
${commands
  .map(
    ({ folder, filename, filenameCamel }) =>
      `import ${filenameCamel} from '${config.commandPathAbsolute}/${folder}/${filename}'`,
  )
  .join('\n')}

export const commands = [
  ${commands.map(({ filenameCamel }) => filenameCamel).join(',\n  ')}
]
`

writeFileSync(join(cwd, config.resultPath, 'commands.ts'), commandsText)

// ------

const interactionsFolderPath = readdirSync(join(cwd, config.interactionPath))
const interactions = []

for (const item of interactionsFolderPath) {
  interactions.push(
    ...readdirSync(join(cwd, config.interactionPath, item)).map((filename) => ({
      folder: item,
      filename: removeExtension(filename),
      filenameCamel: snakeToCamel(`${item}-${removeExtension(filename)}`),
    })),
  )
}

const interactionsText = `${prefix}
import { BaseInteraction } from '~/bot/base/interaction'

${interactions
  .map(
    ({ folder, filename, filenameCamel }) =>
      `import ${filenameCamel} from '${config.interactionPathAbsolute}/${folder}/${filename}'`,
  )
  .join('\n')}

export const interactions: BaseInteraction[] = [
  ${interactions.map(({ filenameCamel }) => filenameCamel).join(',\n  ')}
]
`

writeFileSync(join(cwd, config.resultPath, 'interactions.ts'), interactionsText)

// ------
