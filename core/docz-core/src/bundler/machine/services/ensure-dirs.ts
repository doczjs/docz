import * as path from 'path'
import * as fs from 'fs-extra'
import * as paths from '../../../config/paths'

export const ensureDirs = async () => {
  await fs.ensureDir(paths.docz)
  return await fs.ensureDir(path.join(paths.docz, 'src/pages'))
}
