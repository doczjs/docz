import * as path from 'path'
import * as fs from 'fs-extra'
import getPkgRepo from 'get-pkg-repo'
import findup from 'find-up'

import * as paths from '../config/paths'

export const repoInfo = (src: string | './'): string | null => {
  try {
    const project = path.parse(findup.sync('.git')).dir
    const root = path.join(paths.root, src);
    const relative = path.relative(project, root)
    const tree = path.join('/tree/master', relative)
    const pkg = fs.readJsonSync(paths.appPackageJson)
    const repo = getPkgRepo(pkg)

    return (
      repo &&
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
