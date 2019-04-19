import * as path from 'path'
import * as fs from 'fs-extra'
import logger from 'signale'
import createLogger from 'progress-estimator'
import * as paths from '../config/paths'

const CACHE_DIR = path.join(paths.cache, '.progress-estimator')

const isCi = () =>
  !!(
    process.env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
    process.env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
    process.env.BUILD_NUMBER || // Jenkins, TeamCity
    process.env.RUN_ID
  ) // TaskCluster, dsari

export const promiseLogger = async (promise: any, message: string) => {
  if (process.stdout.isTTY && !isCi()) {
    await fs.ensureDir(CACHE_DIR)
    return createLogger({
      storagePath: path.join(paths.cache, '.progress-estimator'),
    })(promise, message)
  }
  logger.log(`${message}`)
  return promise
}
