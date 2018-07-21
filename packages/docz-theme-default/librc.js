const svg = require('rollup-plugin-svg')
const pkg = require('./package.json')

const inline = [
  'facepaint',
  'match-sorter',
  'react-breakpoints',
  'react-feather',
  'react-powerplug',
  'webfontloader',
]

const external = Object.keys(pkg.dependencies)
  .filter(dep => inline.indexOf(dep) === -1)
  .concat([
    'polished/lib/colors/rgba',
    'react-syntax-highlighter/prism',
    'react-feather/dist/icons/search',
    'react-feather/dist/icons/chevron-down',
  ])

module.exports = {
  plugins: [svg()],
  external,
}
