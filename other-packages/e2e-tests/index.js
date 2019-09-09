const execa = require('execa')
const path = require('path')
const waitOn = require('wait-on')
const kill = require('kill-port')
const fs = require('fs-extra')
const tmp = require('tmp')
const set = require('lodash/set')

const rootPath = path.join(__dirname, '../../')

const paths = {
  doczCore: path.join(rootPath, 'core/docz-core'),
  docz: path.join(rootPath, 'core/docz'),
  doczGatsbyTheme: path.join(rootPath, 'core/gatsby-theme-docz'),
  // doczUtils: '../../core/docz-utils',
  // rehypeDocz: '../../core/rehype-docz',
  // remarkDocz: '../../core/remark-docz',
}

const e2eTestsPath = __dirname
const runCommand = (
  command,
  cwd = rootPath,
  stdio = 'inherit',
  detached = false
) => {
  const [binary, ...rest] = command.split(' ')
  return execa(binary, rest, { cwd, stdio, detached })
}
const tmpPath = tmp.dirSync({ unsafeCleanup: true, mode: 0o100777 }).name

const examples = {
  // basic: {
  //   path: path.join(rootPath, 'examples/basic'),
  //   tmp: path.join(tmpPath, 'examples/basic'),
  // },
  gatsby: {
    path: path.join(rootPath, 'examples/gatsby'),
    tmp: path.join(tmpPath, 'examples/gatsby'),
  },
}

const setupTestProjects = async () => {}

const installNodeModules = async (packagePath, cacheKey = '') => {
  const cachePath = path.join(rootPath, `.e2e-tests-cache`, cacheKey)
  const freshModulesPath = path.join(packagePath, 'node_modules')
  const hasCache = await fs.pathExists(cachePath)
  if (hasCache) {
    console.log(
      `Using node_modules cache in ${cachePath} for node_modules of ${cacheKey}`,
      {
        cachePath,
        freshModulesPath,
      }
    )
    await fs.remove(freshModulesPath)
    await fs.copy(cachePath, freshModulesPath)
  } else {
    console.log(
      `Couldnt find node_modules cache at ${cachePath} for node_modules of  ${cacheKey}`
    )
    await runCommand(`yarn install`, packagePath)
    await fs.copy(freshModulesPath, cachePath)
  }
}

const ci = async () => {
  console.log(`Preparing tmp examples dir.`)

  for (let exampleName in examples) {
    // await runCommand(`mkdir -p ${tmpPath}/examples/`)
    const example = examples[exampleName]
    await fs.ensureDir(`${tmpPath}/examples/${exampleName}`)

    // copy example to a new temp directory
    // await runCommand(`cp -r ${example.path} ${path.join(example.tmp, '..')}`)
    console.log()
    console.log(`Copying ${exampleName} example to a temporary directory.`)
    console.log(`Source : ${example.path}`)
    console.log(`Destination : ${example.tmp}`)
    console.log()

    await fs.copy(example.path, example.tmp)
    console.log(`Copied ${exampleName} example to a temporary directory.`)

    console.log(`Modifying package.json in ${example.tmp}`)
    const pathToPackageJson = path.join(`${example.tmp}`, 'package.json')
    const packageJson = await fs.readJson(pathToPackageJson)
    // set(packageJson, `dependencies.gatsby-theme-docz`, paths.doczGatsbyTheme)
    await fs.writeJson(pathToPackageJson, packageJson, { spaces: 2 })

    console.log(`Installing modules in tmp directory`)
    await installNodeModules(example.tmp, exampleName)

    runCommand(`yarn dev --port 3000`, example.tmp)
    await waitOn({ resources: ['http://localhost:3000'] })
    console.log('Ready. Starting e2e tests')

    await runCommand('yarn run testcafe:ci', e2eTestsPath)
    await runCommand(`npx kill-port 3000`)
  }
  await fs.remove(tmpPath)
  console.log('done')
  return
}
const setupLocalRegistry = async () => {}

const publishPackages = async () => {}

setupLocalRegistry()
  .then(publishPackages)
  .then(ci)
  .then(() => {
    console.log('Exiting process')
    process.exit()
    console.log('Exited process')
  })
  .catch(err => {
    console.log('Error ', err)
  })
// ;(async () => {
//   await ci()
//   console.log('Exited process')
// })()
