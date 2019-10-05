const execa = require('execa')
const path = require('path')
const waitOn = require('wait-on')
const kill = require('kill-port')
const fs = require('fs-extra')
const tmp = require('tmp')
const set = require('lodash/set')
const get = require('lodash/get')
const { updatePackageJson, revertPackageJson } = require('./helpers')

const VERDACCIO_PORT = 4873
const LOCAL_REGISTRY = `http://localhost:${VERDACCIO_PORT}`
const REMOTE_REGISTRY = `https://registry.npmjs.org/`

const tmpPath = tmp.dirSync({ unsafeCleanup: true, mode: 0o100777 }).name
const rootPath = path.join(__dirname, '../../')
const e2eTestsPath = __dirname

const paths = {
  doczCore: path.join(rootPath, 'core/docz-core'),
  docz: path.join(rootPath, 'core/docz'),
  doczGatsbyTheme: path.join(rootPath, 'core/gatsby-theme-docz'),
  // doczUtils: '../../core/docz-utils',
  // rehypeDocz: '../../core/rehype-docz',
  // remarkDocz: '../../core/remark-docz',
}

const examples = {
  basic: {
    path: path.join(rootPath, 'examples/basic'),
    tmp: path.join(tmpPath, 'examples/basic'),
  },
  gatsby: {
    path: path.join(rootPath, 'examples/gatsby'),
    tmp: path.join(tmpPath, 'examples/gatsby'),
  },
  'monorepo-package': {
    path: path.join(rootPath, 'examples/monorepo-package'),
    tmp: path.join(tmpPath, 'examples/monorepo-package'),
    tmpDoczPackageJson: path.join(
      tmpPath,
      'examples/monorepo-package/packages/basic'
    ),
  },
}

const startLocalRegistry = async () => {
  console.log('Running npx verdaccio')
  runCommand(`npx verdaccio ${e2eTestsPath}/verdaccio.yaml`)
  console.log('Waiting for Verdaccio to boot')
  await waitOn({ resources: [LOCAL_REGISTRY] })
  await runCommand(`npm set registry ${LOCAL_REGISTRY}`)
  await runCommand(`yarn config set registry ${LOCAL_REGISTRY}`)
}

const stopLocalRegistry = async () => {
  await runCommand(`npm set registry ${REMOTE_REGISTRY}`)
  await runCommand(`yarn config set registry ${REMOTE_REGISTRY}`)
}

const runCommand = (
  command,
  { cwd = rootPath, stdio = 'inherit', detached = false } = {
    cwd: rootPath,
    stdio: 'inherit',
    detached: false,
  }
) => {
  const [binary, ...rest] = command.split(' ')
  return execa(binary, rest, { cwd, stdio, detached })
}

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
    await runCommand(`yarn install`, { cwd: packagePath })
    await fs.copy(freshModulesPath, cachePath)
  }
}

const setupLocalRegistry = async () => {
  await startLocalRegistry()
  await updatePackageJson(paths.doczGatsbyTheme, packageJson => {
    set(packageJson, 'version', `0.0.${Date.now()}`)
    return packageJson
  })
  await updatePackageJson(paths.docz, packageJson => {
    const version = get(packageJson, 'version')
    const versionChunks = version.split('.')
    versionChunks[versionChunks.length - 1] = Date.now()
    newVersion = versionChunks.join('.')
    set(packageJson, 'version', newVersion)
    return setDoczVersionToCI(packageJson)
  })
  await updatePackageJson(paths.doczCore, packageJson => {
    const version = get(packageJson, 'version')
    const versionChunks = version.split('.')
    versionChunks[versionChunks.length - 1] = Date.now()
    newVersion = versionChunks.join('.')
    set(packageJson, 'version', newVersion)
    return packageJson
  })
  // Generate the right .npmrc file in the folders to be published
  await runCommand(
    `npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r ${LOCAL_REGISTRY}`,
    { cwd: paths.doczGatsbyTheme }
  )
  await runCommand(
    `npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r ${LOCAL_REGISTRY}`,
    { cwd: paths.docz }
  )
  await runCommand(
    `npx npm-auth-to-token@1.0.0 -u user -p password -e user@example.com -r ${LOCAL_REGISTRY}`,
    { cwd: paths.doczCore }
  )
  await runCommand(`npm publish --tag ci`, { cwd: paths.doczGatsbyTheme })
  console.log('Published gatsby')
  await runCommand(`npm publish --tag ci`, { cwd: paths.docz })
  console.log('Published docz')
  await runCommand(`npm publish --tag ci`, { cwd: paths.doczCore })
  console.log('Published core')
}

const setDoczVersionToCI = packageJson => {
  if (get(packageJson, 'dependencies.gatsby-theme-docz', false)) {
    set(packageJson, 'dependencies.gatsby-theme-docz', 'ci')
  }
  if (get(packageJson, 'dependencies.docz', false)) {
    set(packageJson, 'dependencies.docz', 'ci')
  }
  if (get(packageJson, 'dependencies.docz-core', false)) {
    set(packageJson, 'dependencies.docz-core', 'ci')
  }
  return packageJson
}

const runTests = async () => {
  // return
  console.log(`Preparing tmp examples dir.`)
  let PORT = 3000
  for (let exampleName in examples) {
    console.log(`🕕 Running ${exampleName} test`)
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

    await updatePackageJson(example.tmp, pack => {
      return setDoczVersionToCI(pack)
    })
    if ('tmpDoczPackageJson' in example) {
      await updatePackageJson(example.tmpDoczPackageJson, pack => {
        return setDoczVersionToCI(pack)
      })
    }
    console.log({ example })

    console.log(`Installing modules in tmp directory`)
    await installNodeModules(example.tmp, exampleName)

    // await runCommand(`yarn build`, example.tmp)
    const command = runCommand(`yarn dev --port ${PORT}`, { cwd: example.tmp })

    await waitOn({ resources: [`http://localhost:${PORT}`] })
    console.log('Ready. Starting e2e tests')

    await runCommand('yarn run testcafe:ci', { cwd: e2eTestsPath })
    command.kill('SIGTERM', {
      forceKillAfterTimeout: 2000,
    })
    await kill(3000, 'tcp')
    console.log(`✅ Ran ${exampleName} test successfully`)
  }
  await fs.remove(tmpPath)
  console.log('done')
  return
}

const cleanup = async () => {
  console.log('Cleaning up')
  await stopLocalRegistry()
  await revertPackageJson(paths.doczGatsbyTheme)
  await revertPackageJson(paths.docz)
  await revertPackageJson(paths.doczCore)
}

;(async () => {
  await setupLocalRegistry()
  await runTests()
  await cleanup()
  console.log('Exiting process')
  process.exit(0)
})()

// /var/folders/jn/3z685bls0mv64x4q1vjrzgy40000gn/T/tmp-546690gUnJPBhzg0U/examples/basic
