const { omit, get } = require('lodash')
const typescript = require('@pedronauck/rollup-plugin-typescript2')
const babel = require('rollup-plugin-babel')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')

const sizePlugin = require('./plugins/size')
const copyPlugin = require('./plugins/copy')

const output = (format, outputDir, { plugins = [], external, ...opts }) => ({
  ...opts,
  external,
  output: {
    format,
    dir: outputDir,
    chunkFileNames: `[name]${format !== 'cjs' ? '.[format]' : ''}.js`,
    entryFileNames: `[name]${format !== 'cjs' ? '.[format]' : ''}.js`,
  },
  plugins: [
    peerDepsExternal({
      includeDependencies: true,
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: false,
    }),
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    sizePlugin(outputDir),
  ].concat(plugins),
})

exports.copy = copyPlugin
exports.config = (initial = {}) => {
  const outputDir = get(initial, 'outputDir', 'dist')
  const optsInput = get(initial, 'input', [])
  const input = Array.isArray(optsInput) ? optsInput : [optsInput]
  const opts = omit(initial, ['outputDir'])
  return [output('cjs', outputDir, opts), output('esm', outputDir, opts)]
}
