import * as path from 'path'
import * as fs from 'fs-extra'
import getPkgRepo from 'get-pkg-repo'
import findup from 'find-up'

import * as paths from '../config/paths'

// TODO: type repo object returned from get-pkg-repo
export const parseRepo = (): any => {
  try {
    const pkg = fs.readJsonSync(paths.appPackageJson)
    return getPkgRepo(pkg)
  } catch (err) {
    return null
  }
}

export const getRepoUrl = () => {
  const repo = parseRepo()

  return (
    repo &&
    repo.browsetemplate
      .replace('{domain}', repo.domain)
      .replace('{user}', repo.user)
      .replace('{project}', repo.project)
      .replace('{/tree/committish}', '')
  )
}

export const getRepoEditUrl = (src: string): string | null => {
  const project = path.parse(findup.sync('.git')).dir
  const root = path.join(paths.root, src)
  const relative = path.relative(project, root)
  const tree = path.join('/edit/master', relative)
  const repo = parseRepo()

  return (
    repo &&
    repo.browsetemplate
      .replace('{domain}', repo.domain)
      .replace('{user}', repo.user)
      .replace('{project}', repo.project)
      .replace('{/tree/committish}', tree)
  )
}
