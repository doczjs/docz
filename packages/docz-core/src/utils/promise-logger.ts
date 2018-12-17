import * as path from 'path'
import * as fs from 'fs-extra'
import createLogger from 'progress-estimator'
import * as paths from '../config/paths'

const CACHE_DIR = path.join(paths.cache, '.progress-estimator')

export const promiseLogger = async (...args: any[]) => {
  await fs.ensureDir(CACHE_DIR)
  return createLogger({
    storagePath: path.join(paths.cache, '.progress-estimator'),
  })(...args)
}
