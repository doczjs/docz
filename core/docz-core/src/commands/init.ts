process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import { finds } from 'load-cfg'
import findUp from 'find-up'

import { parseConfig } from '../config/docz'
import { getIsFirstInstall, getIsDoczRepo } from '../bundler/machine/actions'
import {
  ensureDirs,
  createResources,
  installDeps,
} from '../bundler/machine/services'

export const init = async (args: Arguments<any>) => {
  const doczrcFilepath = await findUp(finds('docz'))
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
  await installDeps(serverMachineContext)
  console.log()
  console.log(`✅    Docz is ready to go `)
  console.log()
  console.log(`💻    yarn docz dev`)
  console.log(`⛏    yarn docz build`)
  console.log(`👀    yarn docz serve`)
  console.log()
}
