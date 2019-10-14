process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import path from 'path'

import { parseConfig } from '../config/docz'
import { getIsFirstInstall, getIsDoczRepo } from '../bundler/machine/actions'
import { ensureDirs, createResources } from '../bundler/machine/services'
import { copyDoczRc } from '../bundler/machine/services/create-resources'
import * as paths from '../config/paths'

export const init = async (args: Arguments<any>) => {
  copyDoczRc(args.config)
  const doczrcFilepath = path.join(paths.docz, 'doczrc.js')
  const config = await parseConfig(args)
  const isFirstInstall = getIsFirstInstall()
  const isDoczRepo = getIsDoczRepo()
  await ensureDirs()
  const serverMachineContext = {
    args: config,
    isDoczRepo,
    firstInstall: isFirstInstall,
    doczrcFilepath,
  }
  await createResources(serverMachineContext)
  console.log()
  console.log(`✅    Docz is ready to go `)
  console.log()
  console.log(`💻    yarn docz dev`)
  console.log(`⛏    yarn docz build`)
  console.log(`👀    yarn docz serve`)
  console.log()
}
