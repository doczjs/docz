import * as fs from 'fs-extra'
import chalk from 'chalk'
import logger from 'signale'
import webpack, { Configuration } from 'webpack'
import FSR from 'react-dev-utils/FileSizeReporter'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import printBuildError from 'react-dev-utils/printBuildError'

import * as paths from '../config/paths'
import { Entries } from '../Entries'
import { loadConfig } from '../utils/load-config'
import { webpack as webpackBundler } from '../bundlers'
import { Config } from './args'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'production'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = FSR
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const hasCiEnvVar = () =>
  process.env.CI &&
  (typeof process.env.CI !== 'string' ||
    process.env.CI.toLowerCase() !== 'false')

const copyPublicFolder = async (): Promise<void> => {
  if (await fs.pathExists(paths.appPublic)) {
    await fs.copySync(paths.appPublic, paths.distPublic, {
      dereference: true,
      filter: file => file !== paths.indexHtml,
    })
  }
}

const compile = (config: Configuration) =>
  new Promise((resolve, reject) => {
    let compiler
    try {
      compiler = webpack(config)
    } catch (err) {
      onError(err)
    }
    compiler &&
      compiler.run((err, stats) => {
        if (err) reject(err)
        resolve(stats)
      })
  })

const builder = async (config: Configuration, previousFileSizes: any) => {
  logger.start('Creating an optimized production build...')

  return new Promise(async (resolve, reject) => {
    try {
      const stats: any = await compile(config)
      const messages = formatWebpackMessages(stats.toJson({}, true))

      if (messages.errors.length) {
        return reject(new Error(messages.errors.join('\n\n')))
      }

      if (hasCiEnvVar() && messages.warnings.length) {
        logger.warn(
          '\nTreating warnings as errors because process.env.CI = true.\n' +
            'Most CI servers set it automatically.\n'
        )
        return reject(new Error(messages.warnings.join('\n\n')))
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      })
    } catch (err) {
      reject(err)
    }
  })
}

const onSuccess = ({ stats, previousFileSizes, warnings }: any) => {
  if (warnings.length) {
    logger.warn('Compiled with warnings.\n')
    logger.warn(warnings.join('\n\n'))
    logger.warn(
      '\nSearch for the ' +
        chalk.underline(chalk.yellow('keywords')) +
        ' to learn more about each warning.'
    )
    logger.warn(
      'To ignore, add ' +
        chalk.cyan('// eslint-disable-next-line') +
        ' to the line before.\n'
    )
  } else {
    logger.success(chalk.green('Compiled successfully.\n'))
  }

  logger.log('File sizes after gzip:\n')
  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    paths.dist,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE
  )
  logger.log()
}

const onError = (err: Error) => {
  logger.fatal(chalk.red('Failed to compile.\n'))
  printBuildError(err)
  process.exit(1)
}

export const build = async (args: Config) => {
  try {
    const config = loadConfig(args)
    const bundler = webpackBundler(config, 'production')
    const previousFileSizes = await measureFileSizesBeforeBuild(paths.dist)
    const entries = new Entries(config)
    const map = await entries.getMap()

    await fs.emptyDir(paths.dist)
    await copyPublicFolder()
    await Entries.writeImports(map)
    await Entries.writeApp(config)
    await Entries.writeData(map, config)

    const result = await builder(bundler.getConfig(), previousFileSizes)
    onSuccess(result)
  } catch (err) {
    onError(err)
  }
}
