const path = require('path')
const chokidar = require('chokidar')
const { rm, cp, mkdir, test } = require('shelljs')

const copydir = (options = {}) => ({
  onwrite: function(object) {
    for (key in options) {
      const src = key
      const dest = options[key]
      const basepath = path.resolve(dest, src)

      const process = () => {
        rm('-rf', basepath)
        mkdir('-p', basepath)
        cp('-R', src, dest)
      }

      chokidar.watch(path.resolve(src)).on('change', process)
      process()
    }
  },
})

module.exports = {
  plugins: plugins =>
    plugins.concat([
      copydir({
        templates: 'dist',
      }),
    ]),
}
