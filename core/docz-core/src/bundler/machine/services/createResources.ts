import * as path from 'path'
import * as fs from 'fs-extra'
import { format } from 'docz-utils/lib/format'
import { pipe, assoc } from 'lodash/fp'
import findUp from 'find-up'
import shell from 'shelljs'

import * as paths from '../../../config/paths'
import { finds } from 'load-cfg'
import { ServerMachineCtx } from '../context'

const REQUIRED_DEPENDENCIES = [
  'docz',
  'docz-core',
  'docz-theme-default',
  'gatsby-plugin-eslint',
  'gatsby-theme-docz',
  'gatsby',
  'tslib',
  'recast',
]

const assocRequiredDeps = (pipe as any)(
  ...REQUIRED_DEPENDENCIES.map(dep => assoc(dep, 'latest'))
)

const copyPkgJSON = () => {
  const pkgJSON = path.join(paths.root, 'package.json')
  shell.cp(pkgJSON, paths.docz)
}

const copyDoczRc = async () => {
  const filepath = await findUp(finds('docz'))
  shell.cp(filepath, paths.docz)
}

const copyAndModifyPkgJson = async () => {
  const filepath = path.join(paths.root, 'package.json')
  const movePath = path.join(paths.docz, 'package.json')
  const pkgJSON = await fs.readJSON(filepath, { throws: false })
  const newPkgJSON = {
    ...pkgJSON,
    devDependencies: {
      ...pkgJSON.devDependencies,
      ...assocRequiredDeps(pkgJSON.devDependencies || {}),
    },
    scripts: {
      dev: 'gatsby develop',
      build: 'gatsby build',
    },
  }

  await fs.outputJSON(movePath, newPkgJSON, { spaces: 2 })
}

const writeIndexFile = async () => {
  const filepath = path.join(paths.docz, 'src/pages/index.mdx')
  await fs.outputFile(filepath, `# Hello world`)
}

const writeConfigFile = async (config: any, debug: boolean) => {
  const filepath = path.join(paths.docz, 'gatsby-config.js')
  const gatsbyConfig = JSON.stringify({
    ...config.gatsbyConfig,
    ...(debug && {
      plugins: [
        {
          resolve: 'gatsby-plugin-eslint',
          options: {
            test: /\.js$|\.jsx$/,
            exclude: /(node_modules|.cache|public|docz\/core)/,
            stages: ['develop'],
            options: {
              emitWarning: true,
              failOnError: false,
            },
          },
        },
      ],
    }),
  })

  const raw = await format(`module.exports = ${gatsbyConfig}`)
  await fs.outputFile(filepath, raw)
}

export const createResources = async ({ config, args }: ServerMachineCtx) => {
  try {
    copyPkgJSON()
    await copyDoczRc()
    await copyAndModifyPkgJson()
    await writeIndexFile()
    await writeConfigFile(config, args.debug)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
