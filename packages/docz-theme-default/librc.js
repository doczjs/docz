const pkg = require('./package.json')

module.exports = {
  external: Object.keys(pkg.dependencies).concat([
    'codemirror/mode/markdown/markdown',
    'codemirror/mode/javascript/javascript',
    'codemirror/mode/jsx/jsx',
    'codemirror/mode/css/css',
    'codemirror/addon/edit/matchbrackets',
    'codemirror/addon/edit/closetag',
    'codemirror/addon/fold/xml-fold',
    'polished/lib/color/rgba',
    'polished/lib/color/lighten',
    'polished/lib/color/darken',
    'polished/lib/mixins/placeholder',
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
    'react-feather/dist/icons/hash',
  ]),
}
