import * as path from 'path'
import * as fs from 'fs-extra'
import { get, getOr, fromPairs } from 'lodash/fp'
import latestVersion from 'latest-version'

import * as paths from '../config/paths'
import { ServerMachineCtx } from '../bundler/machine/context'

const CORE_DEV_DEPS = ['gatsby-theme-docz']
const LOCAL_DEV_DEPS = ['gatsby-plugin-compile-es6-packages', 'p-reduce']
const REQUIRED_DEV_DEPS = [
  'gatsby',
  'gatsby-plugin-typescript',
  'gatsby-plugin-eslint',
]

const depsFromPairs = async (deps: any[], callback: (dep: string) => any) => {
  return fromPairs(await Promise.all(deps.map(callback)))
}

const getCoreVersions = () => async (dep: string) => {
  const depPath = path.join(paths.root, '../../core', dep)
  const pkgJSONFilepath = path.join(depPath, 'package.json')
  const pkg = await fs.readJSON(pkgJSONFilepath, { throws: false })
  const version = await latestVersion(dep)
  return [dep, getOr(version, 'version', pkg)]
}

const getDepVersion = (deps: any, devDeps: any, find?: string) => async (
  dep: string
) => {
  const current = get(find || dep, deps) || get(find || dep, devDeps)
  const latest = await latestVersion(dep)
  return [dep, current || latest]
}

const getDeps = async (depList: any[], ctx: ServerMachineCtx, pkg: any) => {
  const list = ctx.isDoczRepo ? depList.concat(LOCAL_DEV_DEPS) : depList
  const deps = pkg.dependencies
  const devDeps = pkg.devDependencies
  return depsFromPairs(list, getDepVersion(deps, devDeps))
}

const getCoreDeps = async ({ isDoczRepo }: ServerMachineCtx, pkg: any) => {
  const fn = isDoczRepo ? getCoreVersions : getDepVersion
  const deps = pkg.dependencies
  const devDeps = pkg.devDependencies
  return depsFromPairs(CORE_DEV_DEPS, fn(deps, devDeps, 'docz'))
}

export const createDeps = async (ctx: ServerMachineCtx) => {
  const filepath = path.join(paths.root, 'package.json')
  const pkg = await fs.readJSON(filepath, { throws: false })

  return {
    dependencies: {
      ...pkg.dependencies,
      react: '../node_modules/react',
      'react-dom': '../node_modules/react-dom',
    },
    devDependencies: {
      ...pkg.devDependencies,
      ...(await getDeps(REQUIRED_DEV_DEPS, ctx, pkg)),
      ...(await getCoreDeps(ctx, pkg)),
    },
  }
}
