const os = require('os')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const figures = require('figures')
const filesize = require('filesize')
const gzip = require('gzip-size')
const logUpdate = require('log-update')

const cwd = process.cwd()
const label = `${chalk.cyan.bold(figures.arrowRight)}`

const placeholder = text => chalk.gray(`${text}:`)
const getFilesize = file => filesize(fs.statSync(file).size)
const getGzipSize = file => filesize(gzip.sync(fs.readFileSync(file, 'utf-8')))

module.exports = dest => ({
  name: 'size',
  generateBundle(opts, bundle, isWrite) {
    if (!isWrite) return

    const destDir = path.join(cwd, dest)
    const keys = Object.keys(bundle)
    const builds = keys.map(key => bundle[key])

    builds.forEach((build, i) => {
      const filename = keys[i]
      const filepath = path.join(os.tmpdir(), filename)
      fs.outputFileSync(filepath, build.code)

      const size = `${placeholder('size')} ${getFilesize(filepath)}`
      const gzip = ` | ${placeholder('gzip')} ${getGzipSize(filepath)}`
      const sizes = chalk.gray.dim(`(${size}${gzip})`)
      const originalPath = path.join(dest, filename)
      const msg = `${label} ${chalk.cyan(originalPath)} ${sizes}`

      logUpdate(msg)
      logUpdate.done()
      fs.removeSync(filepath)
    })
  },
})
