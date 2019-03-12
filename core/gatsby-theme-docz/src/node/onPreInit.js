const fs = require('fs-extra')
const path = require('path')
const { touch, compiled } = require('docz-utils')
const { parseConfig } = require('../utils/parseConfig')

const fromTemplates = filepath =>
  path.resolve(__dirname, '../../templates', filepath)

const mountComponentPath = paths => component =>
  path.join(paths.app, 'components', component || '')

const touchTemplateWithPaths = paths => async (filepath, opts) => {
  const componentPath = mountComponentPath(paths)
  const dest = componentPath(filepath.replace('.tpl', ''))
  const template = await compiled(fromTemplates(filepath), { minimize: false })
  const raw = template(opts)
  await touch(dest, raw)
}

module.exports = async (_, opts) => {
  const { paths, ...config } = await parseConfig(opts)
  const componentPath = mountComponentPath(paths)
  const touchTemplate = touchTemplateWithPaths(paths)

  await fs.ensureDir(componentPath())
  await fs.copy(fromTemplates('Seo.tpl.js'), componentPath('Seo.js'))
  await fs.copy(fromTemplates('Link.tpl.js'), componentPath('Link.js'))
  await touchTemplate('Layout.tpl.js', {
    theme: config.theme,
    wrapper: config.wrapper,
  })

  return Promise.resolve()
}
