const fs = require('fs-extra')
const path = require('path')

const updatePackageJson = async (pathToSource, reducer = v => v) => {
  console.log(`Modifying package.json in ${pathToSource}`)
  const pathToPackageJson = path.join(`${pathToSource}`, 'package.json')
  await fs.copyFile(
    pathToPackageJson,
    path.join(`${pathToSource}`, 'package.backup.json')
  )
  const packageJson = await fs.readJson(pathToPackageJson)
  const newPackageJson = reducer(packageJson)
  await fs.writeJson(pathToPackageJson, newPackageJson, { spaces: 2 })
}

const revertPackageJson = async pathToSource => {
  const pathToPackageJson = path.join(`${pathToSource}`, 'package.json')
  const pathToBackup = path.join(`${pathToSource}`, 'package.backup.json')
  await fs.move(pathToBackup, pathToPackageJson, { overwrite: true })
}

module.exports = { updatePackageJson, revertPackageJson }
