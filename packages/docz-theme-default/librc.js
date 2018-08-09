const svg = require('rollup-plugin-svg')
const pkg = require('./package.json')

const internal = [
  'facepaint',
  'match-sorter',
  'react-breakpoints',
  'react-feather',
  'react-powerplug',
  'webfontloader',
]

const depsExternal = [
  '@mdx-js/tag',
  'react-dom/server',
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
]

const external = Object.keys(pkg.dependencies)
  .concat(depsExternal)
  .filter(dep => internal.indexOf(dep) === -1)

module.exports = {
  external,
  sourcemap: false,
  plugins: [svg()],
}
