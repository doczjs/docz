const { transformSync } = require('@babel/core')
const fs = require('fs')
const path = require('path')
const plugin = require('../src')

const exportNamedFixture = path.resolve(
  './tests/fixtures/export-named/index.js'
)

const exportDefaultFixtures = {
  withArrExpression: path.resolve(
    './tests/fixtures/export-default/with-arr-expression.js'
  ),
  withClassDeclaration: path.resolve(
    './tests/fixtures/export-default/with-class-declaration.js'
  ),
  withFuncDeclaration: path.resolve(
    './tests/fixtures/export-default/with-func-declaration.js'
  ),
  withIdentifier: path.resolve(
    './tests/fixtures/export-default/with-identifier.js'
  ),
  withObjExpression: path.resolve(
    './tests/fixtures/export-default/with-obj-expression.js'
  ),
  withCallExpression: path.resolve(
    './tests/fixtures/export-default/with-call-expression.js'
  ),
}

const reExportsFixtures = {
  reExportName: path.resolve(
    path.resolve('./tests/fixtures/re-export/re-export.js')
  ),
  reExportDefault: path.resolve(
    path.resolve('./tests/fixtures/re-export/re-export-default.js')
  ),
  reExportDefaultToName: path.resolve(
    path.resolve('./tests/fixtures/re-export/re-export-rename1.js')
  ),
  reExportNameToDefault: path.resolve(
    path.resolve('./tests/fixtures/re-export/re-export-rename2.js')
  ),
  reExportNameToName: path.resolve(
    path.resolve('./tests/fixtures/re-export/re-export-rename3.js')
  ),
}

const getCodeFromFilePath = paths =>
  Object.keys(paths).reduce(
    (acc, key) => ({
      ...acc,
      [key]: fs.readFileSync(paths[key]).toString(),
    }),
    {}
  )

const exportDefaultCode = getCodeFromFilePath(exportDefaultFixtures)
const exportNamedCode = fs.readFileSync(exportNamedFixture).toString()
const reExportCode = getCodeFromFilePath(reExportsFixtures)

describe('export-metadata', () => {
  describe('re-export', () => {
    it('re-export default', () => {
      const result = transformSync(exportDefaultFixtures.reExportName, {
        plugins: [plugin],
        filename: exportNamedFixture.reExportName,
      })

      expect(result.code).toMatchSnapshot()
    })
  })

  describe('export default', () => {
    it('works with Array expression', () => {
      const result = transformSync(exportDefaultCode.withArrExpression, {
        plugins: [plugin],
        filename: exportDefaultFixtures.withArrExpression,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('works with Object expression', () => {
      const result = transformSync(exportDefaultCode.withObjExpression, {
        plugins: [plugin],
        filename: exportDefaultFixtures.withObjExpression,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('works with Class declaration', () => {
      const result = transformSync(exportDefaultCode.withClassDeclaration, {
        plugins: [plugin],
        filename: exportDefaultFixtures.withClassDeclaration,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('works with Function declaration', () => {
      const result = transformSync(exportDefaultCode.withFuncDeclaration, {
        plugins: [plugin],
        filename: exportDefaultFixtures.withFuncDeclaration,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('works with Identifier', () => {
      const result = transformSync(exportDefaultCode.withIdentifier, {
        plugins: [plugin],
        filename: exportDefaultFixtures.withIdentifier,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('works with Call expression', () => {
      const result = transformSync(exportDefaultCode.withCallExpression, {
        plugins: [plugin],
        filename: exportDefaultFixtures.withIdentifier,
      })

      expect(result.code).toMatchSnapshot()
    })
  })

  describe('export named', () => {
    it('works', () => {
      const result = transformSync(exportNamedCode, {
        plugins: [plugin],
        filename: exportNamedFixture,
      })

      expect(result.code).toMatchSnapshot()
    })
  })

  describe('re-export', () => {
    it('re export name', () => {
      const result = transformSync(reExportCode.reExportName, {
        plugins: [plugin],
        filename: reExportsFixtures.reExportName,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('re export default', () => {
      const result = transformSync(reExportCode.reExportDefault, {
        plugins: [plugin],
        filename: reExportsFixtures.reExportDefault,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('re export name to default', () => {
      const result = transformSync(reExportCode.reExportNameToDefault, {
        plugins: [plugin],
        filename: reExportsFixtures.reExportNameToDefault,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('re export default to name', () => {
      const result = transformSync(reExportCode.reExportDefaultToName, {
        plugins: [plugin],
        filename: reExportsFixtures.reExportDefaultToName,
      })

      expect(result.code).toMatchSnapshot()
    })

    it('re export name to name', () => {
      const result = transformSync(reExportCode.reExportNameToName, {
        plugins: [plugin],
        filename: reExportsFixtures.reExportNameToName,
      })

      expect(result.code).toMatchSnapshot()
    })
  })
})
