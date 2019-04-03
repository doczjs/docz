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
}

const exportDefaultCode = Object.keys(exportDefaultFixtures).reduce(
  (acc, key) => ({
    ...acc,
    [key]: fs.readFileSync(exportDefaultFixtures[key]).toString(),
  }),
  {}
)

const exportNamedCode = fs.readFileSync(exportNamedFixture).toString()

describe('export-metadata', () => {
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
})
