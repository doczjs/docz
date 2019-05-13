import * as path from 'path'
import * as fs from 'fs-extra'
import { finds } from 'load-cfg'
import { format } from 'docz-utils/lib/format'
import { compiled } from 'docz-utils/lib/fs'
import { getOr, fromPairs } from 'lodash/fp'
import latestVersion from 'latest-version'
import findUp from 'find-up'
import sh from 'shelljs'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'

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

export const fromTemplates = (file: string) => {
  return path.join(paths.templates, file)
}

const copyPkgJSON = () => {
  const pkgJSON = path.join(paths.root, 'package.json')
  sh.cp(pkgJSON, paths.docz)
}

const copyDoczRc = async () => {
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
    },
    ...(ctx.isDoczRepo && {
      private: true,
      workspaces: ['../../../core/**', '../../../other-packages/**'],
    }),
  }

  await fs.outputJSON(movePath, newPkgJSON, { spaces: 2 })
}

const writeIndexFile = async () => {
  const filepath = path.join(paths.docz, 'src/pages/index.mdx')
  await fs.outputFile(filepath, `# Hello world`)
}

const writeConfigFile = async ({ args, isDoczRepo }: ServerMachineCtx) => {
  const filepath = path.join(paths.docz, 'gatsby-config.js')
  const configFilepath = fromTemplates('gatsby-config.tpl.js')
  const gatsbyConfig = await compiled(configFilepath, { minimize: false })
  const file = gatsbyConfig({
    isDoczRepo,
    config: JSON.stringify({ ...args, root: paths.docz }),
  })

  const raw = await format(file)
  await fs.outputFile(filepath, raw)
}

const writeEslintRc = async ({ isDoczRepo }: ServerMachineCtx) => {
  if (!isDoczRepo) return
  const filepath = path.join(paths.docz, '.eslintrc')
  await fs.outputJSON(filepath, { extends: 'react-app' })
}

const doczFilepath = (filepath: string) => path.join(paths.docz, filepath)
const fixDuplicatedReact = async ({ isDoczRepo }: ServerMachineCtx) => {
  if (!isDoczRepo) return
  const gatsbyNodeFilepath = fromTemplates('gatsby-node.tpl.js')
  const gatsbyHTMLFilepath = fromTemplates('gatsby-html.tpl.js')

  const opts = { minimize: false }
  const gatsbyNode = await compiled(gatsbyNodeFilepath, opts)
  const gatsbyHTML = await compiled(gatsbyHTMLFilepath, opts)
  const gatsbyNodeRaw = await format(gatsbyNode({}))
  const gatsbyHTMLRaw = await format(gatsbyHTML({}))

  await fs.outputFile(doczFilepath('gatsby-node.js'), gatsbyNodeRaw)
  await fs.outputFile(doczFilepath('src/html.js'), gatsbyHTMLRaw)
}

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    copyPkgJSON()
    await copyDoczRc()
    await copyAndModifyPkgJson(ctx)
    await writeIndexFile()
    await writeConfigFile(ctx)
    await writeEslintRc(ctx)
    await fixDuplicatedReact(ctx)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}
