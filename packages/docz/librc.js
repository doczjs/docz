const copy = require('rollup-plugin-cpy')

module.exports = {
  external: ['react-router-dom', 'history'],
  copy({
    files: 'index.d.ts',
    dest: 'dist'
  })
}
