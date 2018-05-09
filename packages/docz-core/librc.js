const copy = require('rollup-plugin-cpy')
const pkg = require('./package.json')

module.exports = {
  plugins: [
    copy([
      {
        files: 'templates/*.{js,html,json}',
        dest: 'dist/templates',
      },
    ]),
  ],
}
