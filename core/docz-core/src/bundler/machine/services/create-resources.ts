import * as path from 'path'
import * as fs from 'fs-extra'
import { finds } from 'load-cfg'
import { omit } from 'lodash/fp'
import findUp from 'find-up'
import sh from 'shelljs'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'
import { outputFileFromTemplate } from '../../../utils/template'

export const copyDoczRc = async () => {
  const filepath = await findUp(finds('docz'))
  filepath && sh.cp(filepath, paths.docz)
}

const copyAndModifyPkgJson = async (ctx: ServerMachineCtx) => {
  const movePath = path.join(paths.docz, 'package.json')
  // const pkg = await fs.readJSON(filepath, { throws: false })
  const newPkg = {
    name: 'docz-app',
    dependencies: {
      gatsby: 'just-to-fool-cli-never-installed',
    },
    scripts: {
      dev: 'gatsby develop',
      build: 'gatsby build',
      serve: 'gatsby serve',
    },
    ...(ctx.isDoczRepo && {
      private: true,
      workspaces: ['../../../core/**', '../../../other-packages/**'],
    }),
  }
  await fs.outputJSON(movePath, newPkg, { spaces: 2 })
}

const writeEslintRc = async ({ isDoczRepo }: ServerMachineCtx) => {
  if (!isDoczRepo) return
  const filepath = path.join(paths.docz, '.eslintrc')
  await fs.outputJSON(filepath, { extends: 'react-app' })
}

export const writeNotFound = async () => {
  const outputPath = path.join(paths.docz, 'src/pages/404.js')
  await outputFileFromTemplate('404.tpl.js', outputPath, {})
}

const writeGatsbyConfig = async ({ args, isDoczRepo }: ServerMachineCtx) => {
  const outputPath = path.join(paths.docz, 'gatsby-config.js')
  const config = omit(['plugins'], args)
  const newConfig = {
    ...config,
    root: paths.docz,
  }

  await outputFileFromTemplate('gatsby-config.tpl.js', outputPath, {
    isDoczRepo,
    config: newConfig,
    opts: JSON.stringify(newConfig),
  })
}

const writeGatsbyConfigNode = async () => {
  const outputPath = path.join(paths.docz, 'gatsby-node.js')
  await outputFileFromTemplate('gatsby-node.tpl.js', outputPath)
}

const copyGatsbyConfigFile = async (from: string, to: string) => {
  const filepath = path.join(paths.root, from)
  const dest = path.join(paths.docz, to)
  if (fs.pathExistsSync(filepath)) {
    await fs.copy(filepath, dest)
  }
}

const writeGatsbyConfigCustom = async () =>
  copyGatsbyConfigFile('gatsby-config.js', 'gatsby-config.custom.js')

const writeGatsbyNodeCustom = async () =>
  copyGatsbyConfigFile('gatsby-node.js', 'gatsby-node.custom.js')

const writeGatsbySSR = async () =>
  copyGatsbyConfigFile('gatsby-ssr.js', 'gatsby-ssr.js')

const writeGatsbyBrowser = async () =>
  copyGatsbyConfigFile('gatsby-browser.js', 'gatsby-browser.js')

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    await copyDoczRc()
    await copyAndModifyPkgJson(ctx)
    await writeEslintRc(ctx)
    await writeNotFound()
    await writeGatsbyConfig(ctx)
    await writeGatsbyConfigNode()
    await writeGatsbyConfigCustom()
    await writeGatsbyNodeCustom()
    await writeGatsbyBrowser()
    await writeGatsbySSR()
  } catch (err) {
    console.log(err)
  }
}
