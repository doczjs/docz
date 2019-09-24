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

const watchPackage = (name, outputDir) => {
  const sourcePath = path.join(rootPath, `core/${name}/${outputDir}`)
  const destinationPath = path.join(__dirname, `node_modules/${name}/`)
  const sourceRootPath = path.join(rootPath, `core/${name}/`)
  const build = runCommand(`yarn run dev`, { cwd: sourceRootPath })
  const sync = cpx.watch(`${sourcePath}/*`, destinationPath)
  sync.on('copy', e => {
    onFileChanged()
  })
  sync.on('remove', e => {
    onFileChanged()
  })
  const stop = () => {
    build.cancel()
    sync.removeAllListeners()
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
    const stopWatchingPackage = watchPackage(package.name, package.outputDir)
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
