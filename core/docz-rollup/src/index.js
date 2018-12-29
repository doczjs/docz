const { omit, get } = require('lodash')
const typescript = require('@pedronauck/rollup-plugin-typescript2')
const babel = require('rollup-plugin-babel')

const sizePlugin = require('./plugins/size')
const copyPlugin = require('./plugins/copy')

const defaultExternal = id =>
  !id.startsWith('\0') && !id.startsWith('.') && !id.startsWith('/')

const output = (format, outputDir, { plugins = [], external, ...opts }) => ({
  ...opts,
  external: external || defaultExternal,
  output: {
    format,
    dir: outputDir,
    chunkFileNames: `[name]${format !== 'cjs' ? '.[format]' : ''}.js`,
    entryFileNames: `[name]${format !== 'cjs' ? '.[format]' : ''}.js`,
  },
  plugins: plugins.concat([
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: false,
    }),
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    sizePlugin(outputDir),
  ]),
})

exports.copy = copyPlugin
exports.config = (initial = {}) => {
  const outputDir = get(initial, 'outputDir', 'dist')
  const optsInput = get(initial, 'input', [])
  const input = Array.isArray(optsInput) ? optsInput : [optsInput]
  const opts = omit(initial, ['outputDir'])
  return [output('cjs', outputDir, opts), output('esm', outputDir, opts)]
}
