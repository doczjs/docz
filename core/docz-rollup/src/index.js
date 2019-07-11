const { omit } = require('lodash/fp')
const autoprefixer = require('autoprefixer')
const typescript = require('rollup-plugin-typescript2')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const alias = require('rollup-plugin-alias')
const postcss = require('rollup-plugin-postcss')
const progress = require('rollup-plugin-progress')

const clean = require('./plugins/clean')
const size = require('./plugins/size')
const copy = require('./plugins/copy')

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.es6', '.es', '.mjs']
const omitOpts = omit([
  'alias',
  'external',
  'output',
  'plugins',
  'runtimeHelpers',
  'filename',
])

const defaultExternal = id =>
  !id.startsWith('\0') &&
  !id.startsWith('~') &&
  !id.startsWith('.') &&
  !id.startsWith('/')

const createOutput = (dir = 'dist', defaultOpts) => {
  const opts = omitOpts(defaultOpts)
  const {
    alias: moduleAlias,
    external,
    output,
    plugins = [],
    runtimeHelpers,
    filename,
  } = defaultOpts

  const defaultPlugins = [
    clean(dir),
    postcss({
      plugins: [autoprefixer()],
      inject: false,
    }),
    Object.keys(moduleAlias || {}).length > 0 &&
      alias({
        ...moduleAlias,
        resolve: EXTENSIONS,
      }),
    nodeResolve({
      mainFields: ['module', 'main'],
      browser: true,
    }),
    commonjs({
      include: /\/node_modules\//,
    }),
    json(),
    typescript({
      typescript: require('typescript'),
      rollupCommonJSResolveHack: true,
    }),
    babel({
      runtimeHelpers,
      extensions: EXTENSIONS,
      exclude: 'node_modules/**',
    }),
    size(dir),
    progress({
      clearLine: false,
    }),
  ]

  const outputs = [
    {
      dir,
      format: 'cjs',
      chunkFileNames: filename ? `${filename}.js` : `[name].js`,
      entryFileNames: filename ? `${filename}.js` : `[name].js`,
      ...output,
    },
    {
      dir,
      format: 'esm',
      chunkFileNames: filename ? `${filename}.esm.js` : `[name].esm.js`,
      entryFileNames: filename ? `${filename}.esm.js` : `[name].esm.js`,
      ...output,
    },
  ]

  return {
    ...opts,
    external: external || defaultExternal,
    plugins: defaultPlugins.filter(Boolean).concat(plugins),
    output: outputs,
  }
}

exports.copy = copy
exports.config = opts => {
  const inputs = Array.isArray(opts) ? opts : [opts]
  return inputs.map(({ dest: dir, ...opts }) => createOutput(dir, opts))
}
