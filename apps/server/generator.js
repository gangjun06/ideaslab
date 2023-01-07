/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync, writeFileSync, mkdirSync, existsSync } = require('fs')
const path = require('path')

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

if (!existsSync(path.join(__dirname, config.resultPath))) {
  mkdirSync(path.join(__dirname, config.resultPath))
}

// -----------------------------

const eventsPath = readdirSync(path.join(__dirname, config.eventPath))
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

writeFileSync(path.join(__dirname, config.resultPath, 'events.ts'), eventText)

// ------

const commandsFolderPath = readdirSync(path.join(__dirname, config.commandPath))
const commands = []

for (const item of commandsFolderPath) {
  commands.push(
    ...readdirSync(path.join(__dirname, config.commandPath, item)).map((filename) => ({
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

writeFileSync(path.join(__dirname, config.resultPath, 'commands.ts'), commandsText)

// ------

const interactionsFolderPath = readdirSync(path.join(__dirname, config.interactionPath))
const interactions = []

for (const item of interactionsFolderPath) {
  interactions.push(
    ...readdirSync(path.join(__dirname, config.interactionPath, item)).map((filename) => ({
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

writeFileSync(path.join(__dirname, config.resultPath, 'interactions.ts'), interactionsText)

// ------
