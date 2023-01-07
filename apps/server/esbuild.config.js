const { buildSync } = require('esbuild')
const { copyFileSync, readdirSync } = require('fs')
const { join } = require('path')

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

copyFileSync(join(__dirname, './prisma/schema.prisma'), join(__dirname, './dist/schema.prisma'))
const engineName = readdirSync(join(__dirname, '../../node_modules/.prisma/client')).filter(
  (name) => name.startsWith('libquery_engine'),
)[0]
copyFileSync(
  join(__dirname, `../../node_modules/.prisma/client/${engineName}`),
  join(__dirname, 'dist', engineName),
)
