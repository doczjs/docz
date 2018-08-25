const svg = require('rollup-plugin-svg')
const pkg = require('./package.json')

const internal = [
  'facepaint',
  'match-sorter',
  'react-feather',
  'react-powerplug',
  'webfontloader',
]

const depsExternal = [
  '@mdx-js/tag',
  'react-codemirror',
  'codemirror',
  'react-dom/server',
  'codemirror/mode/markdown/markdown',
  'codemirror/mode/javascript/javascript',
  'codemirror/mode/jsx/jsx',
  'codemirror/mode/css/css',
  'codemirror/addon/edit/matchbrackets',
  'polished/lib/color/rgba',
  'polished/lib/color/lighten',
  'polished/lib/color/darken',
  'react-feather/dist/icons/edit-2',
  'react-feather/dist/icons/chevron-down',
  'react-feather/dist/icons/search',
  'react-feather/dist/icons/clipboard',
  'react-feather/dist/icons/check',
  'react-feather/dist/icons/smartphone',
  'react-feather/dist/icons/tablet',
  'react-feather/dist/icons/monitor',
  'react-feather/dist/icons/maximize',
  'react-feather/dist/icons/minimize',
  'react-feather/dist/icons/refresh-cw',
]

const external = Object.keys(pkg.dependencies)
  .concat(depsExternal)
  .filter(dep => internal.indexOf(dep) === -1)

module.exports = {
  external,
  sourcemap: false,
  plugins: [svg()],
}
