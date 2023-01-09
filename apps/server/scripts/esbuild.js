/* eslint-disable */

const { buildSync } = require('esbuild')
const { copyFileSync, readdirSync } = require('fs')
const { join } = require('path')

const cwd = process.cwd()

buildSync({
  entryPoints: ['src/index.ts'],
  outfile: './dist/index.js',
  bundle: true,
  minify: false,
  platform: 'node',
  sourcemap: 'external',
  plugins: [],
  watch: process.env.NODE_ENV === 'development',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})

copyFileSync(join(cwd, '../../packages/db/prisma/schema.prisma'), join(cwd, './dist/schema.prisma'))
const engineName = readdirSync(join(cwd, '../../node_modules/.prisma/client')).filter((name) =>
  name.startsWith('libquery_engine'),
)[0]
copyFileSync(
  join(cwd, `../../node_modules/.prisma/client/${engineName}`),
  join(cwd, 'dist', engineName),
)
