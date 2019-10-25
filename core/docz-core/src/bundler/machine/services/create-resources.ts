import * as path from 'path'
import * as fs from 'fs-extra'
import { omit } from 'lodash/fp'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'
import { outputFileFromTemplate } from '../../../utils/template'

export const copyDoczRc = (configPath?: string) => {
  const sourceDoczRc = configPath
    ? path.join(paths.root, configPath)
    : path.join(paths.root, 'doczrc.js')
  const destinationDoczRc = path.join(paths.docz, 'doczrc.js')
  try {
    fs.copySync(sourceDoczRc, destinationDoczRc)
  } catch (err) {
    // console.error(
    //   `Failed to copy doczrc.js from ${sourceDoczRc} to ${destinationDoczRc} : ${err.message}`,
    //   err.stack
    // )
  }
}

const copyAndModifyPkgJson = async (ctx: ServerMachineCtx) => {
  const movePath = path.join(paths.docz, 'package.json')
  // const pkg = await fs.readJSON(filepath, { throws: false })
  const newPkg = {
    name: 'docz-app',
    license: 'MIT',
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

const copyEslintIgnore = async () => {
  const filename = '.eslintignore'
  const filepath = path.join(paths.root, filename)
  const dest = path.join(paths.docz, filename)

  if (fs.pathExistsSync(filepath)) {
    await fs.copy(filepath, dest)
  }
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
    copyDoczRc(ctx.args.config)
    await copyAndModifyPkgJson(ctx)
    await writeEslintRc(ctx)
    await copyEslintIgnore()
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
