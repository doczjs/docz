import { pipe } from 'lodash/fp'
import log from 'signale'
import chalk from 'chalk'
import shell from 'shelljs'
import ora from 'ora'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'

const warn: Function = pipe(
  chalk.yellow,
  console.log
)

export const installDeps = async ({ firstInstall }: ServerMachineCtx) => {
  if (firstInstall) {
    warn('\n----------------')
    warn(`We need to install some dependencies in order to run your bundler.`)
    warn('This just happen in the first time you run docz.')
    warn('This could take a while!')
    warn('----------------\n')
  }

  return new Promise((resolve, reject) => {
    const checking = !firstInstall && ora('Checking dependencies...').start()
    firstInstall && log.await('Installing dependencies\n')

    shell.cd(paths.docz)
    shell.exec('yarn install', { silent: !firstInstall }, code => {
      if (firstInstall) log.success('\nDependencies installed successfully!\n')
      if (checking) checking.succeed('Dependencies checked!')
      if (code !== 0) return reject()
      return resolve()
    })
  })
}
