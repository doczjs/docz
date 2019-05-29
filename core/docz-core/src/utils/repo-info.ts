import * as path from 'path'
import * as fs from 'fs-extra'
import getPkgRepo from 'get-pkg-repo'
import findup from 'find-up'

import * as paths from '../config/paths'
import { Config } from '../config/argv'

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
    ((repo.browsetemplate &&
      repo.browsetemplate
        .replace('{domain}', repo.domain)
        .replace('{user}', repo.user)
        .replace('{project}', repo.project)
        .replace('{/tree/committish}', '')) ||
      (repo.browse && repo.browse()))
  )
}

const getBitBucketPath = (branch: string, relative: string) => {
  const querystring = `?mode=edit&spa=0&at=${branch}&fileviewer=file-view-default`
  const filepath = path.join(`/src/${branch}`, relative, `{{filepath}}`)
  return `${filepath}${querystring}`
}

const getTree = (repo: any, branch: string, relative: string) => {
  const defaultPath = path.join(`/edit/${branch}`, relative, `{{filepath}}`)
  const bitBucketPath = getBitBucketPath(branch, relative)

  if (repo && repo.type === 'bitbucket') return bitBucketPath
  return defaultPath
}

export const getRepoEditUrl = (config: Config): string | null => {
  try {
    const repo = parseRepo()
    const project = path.parse(findup.sync('.git')).dir
    const root = path.join(paths.getRootDir(config), config.src)
    const relative = path.relative(project, root)
    const tree = getTree(repo, config.editBranch, relative)

    return (
      repo &&
      repo.browsetemplate &&
      repo.browsetemplate
        .replace('{domain}', repo.domain)
        .replace('{user}', repo.user)
        .replace('{project}', repo.project)
        .replace('{/tree/committish}', tree)
    )
  } catch (err) {
    return null
  }
}
