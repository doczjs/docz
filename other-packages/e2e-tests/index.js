const execa = require('execa')
const path = require('path')
const waitOn = require('wait-on')
const kill = require('kill-port')
var tmp = require('tmp')

// const paths = {
//   doczCore: '../../core/docz-core',
//   docz: '../../core/docz',
//   doczUtils: '../../core/docz-utils',
//   rehypeDocz: '../../core/rehype-docz',
//   remarkDocz: '../../core/remark-docz',
// }

const rootPath = path.join(__dirname, '../../')
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
  basic: {
    path: path.join(rootPath, 'examples/basic'),
    tmp: path.join(tmpPath, 'examples/basic'),
  },
  // gatsby: {
  //   path: path.join(rootPath, 'examples/gatsby'),
  //   tmp: path.join(tmpPath, 'examples/gatsby'),
  // },
}

const setupTestProjects = async () => {}

const dev = async () => {
  await runCommand('yarn packages:build')
  runCommand('yarn packages:dev', rootPath, 'ignore')
  runCommand('yarn lerna run testcafe:dev --scope e2e-tests --parallel')

  await runCommand(`mkdir -p ${tmpPath}/examples/`)
  await setupTestProjects()

  process.exit(1)
}

const ci = async () => {
  await runCommand(`mkdir -p ${tmpPath}/examples/`)
  for (let exampleName in examples) {
    const example = examples[exampleName]
    await runCommand(`cp -r ${example.path} ${path.join(example.tmp, '..')}`)
    await runCommand(`rm -rf node_modules`, example.tmp)
    await Promise.all([
      runCommand(`yarn install`, example.tmp),
      kill(3000, 'tcp'),
    ])
    runCommand(`yarn kill-port 3000`, rootPath)
    runCommand(`yarn dev --port 3000`, example.tmp)
    await waitOn({ resources: ['http://localhost:3000'] })
    console.log('Ready. Starting e2e tests')
    await runCommand('yarn run testcafe:ci --scope e2e-tests', e2eTestsPath)
    console.log(`Tests for example ${exampleName} complete `)
    process.exit(0)
  }
}

;(async () => {
  await ci()
})()
