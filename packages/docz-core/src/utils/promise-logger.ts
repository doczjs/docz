import * as path from 'path'
import createLogger from 'progress-estimator'
import * as paths from '../config/paths'

export const promiseLogger = createLogger({
  storagePath: path.join(paths.cache, '.progress-estimator'),
})
