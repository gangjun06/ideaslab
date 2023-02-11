/* eslint-disable */

const chalk = require('chalk')
const { build } = require('esbuild')
const { copyFileSync, readdirSync, existsSync, mkdirSync } = require('fs')
const { join } = require('path')
const { exec } = require('child_process')

const cwd = process.cwd()

const targetDir = join(cwd, './.dev')

const dbEngine = process.env.DB_ENGINE

if (!existsSync(targetDir)) {
  mkdirSync(targetDir)
}

copyFileSync(join(cwd, '../../packages/db/prisma/schema.prisma'), join(targetDir, 'schema.prisma'))
const engineName = readdirSync(join(cwd, '../../node_modules/.prisma/client')).filter(
  (name) => name.startsWith('libquery_engine') && (dbEngine ? name.includes(dbEngine) : true),
)[0]
copyFileSync(
  join(cwd, `../../node_modules/.prisma/client/${engineName}`),
  join(targetDir, engineName),
)

copyFileSync(join(cwd, './.env'), join(targetDir, '.env'))

console.log(chalk.blueBright.bold('🚀 Development server started!'))

build({
  entryPoints: ['./src/index.ts'],
  outfile: './.dev/index.js',
  bundle: true,
  sourcemap: 'external',
  platform: 'node',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  },
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log(chalk.blueBright(`🚀 watch build succeeded:`), result)
      exec('yarn run build:types')
    },
  },
  minify: false,
})
