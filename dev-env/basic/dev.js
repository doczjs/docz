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
  const build = runCommand(`yarn run dev`, { cwd: sourceRootPath }).catch(
    err => {
      console.log(`Error building  ${sourceRootPath}`, err)
      process.exit(1)
    }
  )
  const sync = cpx.watch(`${sourcePath}/*`, destinationPath)
  sync.on('copy', e => {
    onFileChanged()
  })
  sync.on('remove', e => {
    onFileChanged()
  })
  const stop = () => {
    build.kill()
    sync.removeAllListeners()
  }
  return stop
}

const main = async () => {
  const watchStoppers = []

  for (let package of packages) {
    const stopWatchingPackage = watchPackage(package.name, package.outputDir)
    console.log('watching package ', package.name)
    watchStoppers.push(stopWatchingPackage)
  }
  const doczDev = runCommand(`yarn docz dev`, { cwd: __dirname })
  watchStoppers.push(() => doczDev.kill())
}

;(async () => {
  await main()
})()
