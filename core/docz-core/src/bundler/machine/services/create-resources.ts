import * as path from 'path'
import * as fs from 'fs-extra'
import { finds } from 'load-cfg'
import { omit, getOr, fromPairs } from 'lodash/fp'
import latestVersion from 'latest-version'
import findUp from 'find-up'
import sh from 'shelljs'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'
import { outputFileFromTemplate } from '../../../utils/template'

const REQUIRED_DEPS = ['react', 'react-dom']
const REQUIRED_DEV_DEPS = ['gatsby', 'gatsby-mdx', 'gatsby-plugin-typescript']
const CORE_DEV_DEPS = ['docz', 'gatsby-theme-docz']
const LOCAL_DEV_DEPS = ['gatsby-plugin-compile-es6-packages', 'p-reduce']

const depsFromPairs = async (deps: any[], callback: (dep: string) => any) => {
  return fromPairs(await Promise.all(deps.map(callback)))
}

const getDependencyVersion = async (dep: string) => {
  const version = await latestVersion(dep)
  return [dep, version]
}

const getCoreVersions = async (dep: string) => {
  const depPath = path.join(paths.root, '../../core', dep)
  const pkgJSONFilepath = path.join(depPath, 'package.json')
  const pkgJSON = await fs.readJSON(pkgJSONFilepath, { throws: false })
  const version = await latestVersion(dep)
  return [dep, getOr(version, 'version', pkgJSON)]
}

const getDeps = async (deps: any[], ctx: ServerMachineCtx) => {
  const list = ctx.isDoczRepo ? deps.concat(LOCAL_DEV_DEPS) : deps
  return depsFromPairs(list, getDependencyVersion)
}

const getCoreDeps = async ({ isDoczRepo }: ServerMachineCtx) => {
  const fn = isDoczRepo ? getCoreVersions : getDependencyVersion
  return depsFromPairs(CORE_DEV_DEPS, fn)
}

const copyPkgJSON = () => {
  const pkgJSON = path.join(paths.root, 'package.json')
  sh.cp(pkgJSON, paths.docz)
}

export const copyDoczRc = async () => {
  const filepath = await findUp(finds('docz'))
  filepath && sh.cp(filepath, paths.docz)
}

const copyAndModifyPkgJson = async (ctx: ServerMachineCtx) => {
  const filepath = path.join(paths.root, 'package.json')
  const movePath = path.join(paths.docz, 'package.json')
  const pkgJSON = await fs.readJSON(filepath, { throws: false })

  const newPkgJSON = {
    ...pkgJSON,
    dependencies: {
      ...pkgJSON.dependencies,
      ...(await getDeps(REQUIRED_DEPS, ctx)),
    },
    devDependencies: {
      ...pkgJSON.devDependencies,
      ...(await getDeps(REQUIRED_DEV_DEPS, ctx)),
      ...(await getCoreDeps(ctx)),
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

  await fs.outputJSON(movePath, newPkgJSON, { spaces: 2 })
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

const copyGatsbyConfigFile = async (from: string, to: string) => {
  const filepath = path.join(paths.root, from)
  const dest = path.join(paths.docz, to)
  if (fs.pathExistsSync(filepath)) {
    await fs.copy(filepath, dest)
  }
}

const writeGatsbyConfigCustom = async () =>
  copyGatsbyConfigFile('gatsby-config.js', 'gatsby-config.custom.js')

const writeGatsbyNode = async () =>
  copyGatsbyConfigFile('gatsby-node.js', 'gatsby-node.js')

const writeGatsbySSR = async () =>
  copyGatsbyConfigFile('gatsby-ssr.js', 'gatsby-ssr.js')

const writeGatsbyBrowser = async () =>
  copyGatsbyConfigFile('gatsby-browser.js', 'gatsby-browser.js')

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    copyPkgJSON()
    await copyDoczRc()
    await copyAndModifyPkgJson(ctx)
    await writeEslintRc(ctx)
    await writeNotFound()
    await writeGatsbyConfig(ctx)
    await writeGatsbyConfigCustom()
    await writeGatsbyNode()
    await writeGatsbyBrowser()
    await writeGatsbySSR()
  } catch (err) {
    console.log(err)
  }
}
