import * as path from 'path'
import * as fs from 'fs-extra'
import { finds } from 'load-cfg'
import { getOr, fromPairs } from 'lodash/fp'
import latestVersion from 'latest-version'
import findUp from 'find-up'
import sh from 'shelljs'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'
import { outputFileFromTemplate } from '../../../utils/template'

const REQUIRED_DEPS = ['react', 'react-dom']
const REQUIRED_DEV_DEPS = ['gatsby', 'gatsby-mdx']
const CORE_DEV_DEPS = ['docz', 'docz-theme-default', 'gatsby-theme-docz']

const LOCAL_DEV_DEPS = [
  'babel-eslint',
  'eslint',
  'eslint-loader',
  'eslint-config-react-app',
  'eslint-loader',
  'eslint-plugin-flowtype',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'gatsby-plugin-compile-es6-packages',
  'gatsby-plugin-eslint',
  'p-reduce',
]

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
  sh.cp(filepath, paths.docz)
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

const writeConfigFile = async ({ args, isDoczRepo }: ServerMachineCtx) => {
  const outputPath = path.join(paths.docz, 'gatsby-config.js')

  await outputFileFromTemplate('gatsby-config.tpl.js', outputPath, {
    isDoczRepo,
    config: JSON.stringify({
      ...args,
      root: paths.docz,
    }),
  })
}

export const writeNotFound = async () => {
  const outputPath = path.join(paths.docz, 'src/pages/404.js')
  await outputFileFromTemplate('404.tpl.js', outputPath, {})
}

const writeGatsbyNode = async () => {
  const outputPath = path.join(paths.docz, 'gatsby-node.js')
  await outputFileFromTemplate('gatsby-node.tpl.js', outputPath)
}

const writeGatsbyHTML = async () => {
  const outputPath = path.join(paths.docz, 'src/html.js')
  await outputFileFromTemplate('gatsby-html.tpl.js', outputPath)
}

const fixDuplicatedReact = async ({ isDoczRepo }: ServerMachineCtx) => {
  if (!isDoczRepo) return
  await writeGatsbyNode()
  await writeGatsbyHTML()
}

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    copyPkgJSON()
    await copyDoczRc()
    await copyAndModifyPkgJson(ctx)
    await writeEslintRc(ctx)
    await writeConfigFile(ctx)
    await writeNotFound()
    await fixDuplicatedReact(ctx)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
