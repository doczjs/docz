import { pipe } from 'lodash/fp'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import sh from 'shelljs'
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

  return new Promise(async (resolve, reject) => {
    sh.cd(paths.docz)

    const checking = !firstInstall && ora('Checking dependencies...').start()
    const result = spawn.sync('yarn', [], { stdio: 'inherit' })

    if (checking) checking.succeed('Dependencies checked!')
    if (result.error) return reject(result.error)
    return resolve()
  })
}
