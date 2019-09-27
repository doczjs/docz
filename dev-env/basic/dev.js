const execa = require('execa')
const path = require('path')
const cpx = require('cpx')
const fs = require('fs')

const rootPath = path.join(__dirname, '../../')

const packages = [
  { name: 'docz-core', outputDir: 'dist' },
  { name: 'docz', outputDir: 'dist' },
  { name: 'gatsby-theme-docz', outputDir: '' },
  { name: 'docz-components', outputDir: 'dist' },
  { name: 'rehype-docz', outputDir: 'dist' },
  { name: 'remark-docz', outputDir: 'dist' },
]

const runCommand = (
  command,
  { cwd = __dirname, stdio = 'inherit', detached = false } = {
    cwd: __dirname,
    stdio: 'inherit',
    detached: false,
  }
) => {
  const [binary, ...rest] = command.split(' ')
  return execa(binary, rest, { cwd, stdio, detached })
}

const onFileChanged = () => {
  fs.writeFileSync(
    path.join(__dirname, 'src/last-change-timestamp.js'),
    `
// Automatically generated do not edit
const timestamp = ${Date.now()}
export default timestamp    
    `
  )
}
const watchPackage = async (name, outputDir) => {
  const sourcePath = path.join(rootPath, `core/${name}/${outputDir}`)
  const destinationPath = path.join(
    __dirname,
    `node_modules/${name}/${outputDir}`
  )
  const sourceRootPath = path.join(rootPath, `core/${name}/`)
  const dev = runCommand(`yarn run dev`, { cwd: sourceRootPath })
  // await runCommand(`yarn run build`, { cwd: sourceRootPath })
  let fileWatchers = []
  // gatsby-theme-docz is not compiled to a different directory, we need to watch the source code without node_modules
  if (name === 'gatsby-theme-docz') {
    fileWatchers.push(cpx.watch(`${sourcePath}/*`, destinationPath))
    fileWatchers.push(cpx.watch(`${sourcePath}/src/**/*`, destinationPath))
    fileWatchers.push(cpx.watch(`${sourcePath}/lib/**/*`, destinationPath))
  } else {
    const sync = cpx.watch(`${sourcePath}/**/*`, destinationPath)
    fileWatchers.push(sync)
  }

  const unsubscribers = fileWatchers.map(fileWatcher => {
    fileWatcher.on('copy', e => {
      // console.log(`\nCOPIED FILE ${e.srcPath} to ${e.dstPath}\n`)
      onFileChanged()
    })
    fileWatcher.on('remove', e => {
      onFileChanged()
    })
    const stop = () => {
      fileWatcher.removeAllListeners()
    }
    return stop
  })
  const stop = () => {
    dev.cancel()
    unsubscribers.forEach(unsub => {
      unsub()
    })
  }
  return stop
}

const main = async () => {
  const watchStoppers = []
  process.on('SIGINT', () => {
    console.log(`\nTerminating ${watchStoppers.length} running processes`)
    for (let stopWatching of watchStoppers) {
      stopWatching()
    }
    console.log(`\nTerminated ${watchStoppers.length} running processes\n`)
    process.exit(0)
  })
  const build = runCommand(`yarn packages:build`, { cwd: rootPath })
  watchStoppers.push(() => build.cancel())
  await build
  for (let package of packages) {
    const stopWatchingPackage = await watchPackage(
      package.name,
      package.outputDir
    )
    console.log('watching package ', package.name)
    watchStoppers.push(stopWatchingPackage)
  }
  const dev = runCommand(`yarn docz dev`, { cwd: __dirname })
  watchStoppers.push(() => dev.cancel())
}

;(async () => {
  try {
    await main()
  } catch (err) {
    console.warn('Failed : ', err.message)
  }
})()
