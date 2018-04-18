const copy = require('rollup-plugin-cpy')

module.exports = {
  copy({
    files: 'index.d.ts',
    dest: 'dist'
  })
}
