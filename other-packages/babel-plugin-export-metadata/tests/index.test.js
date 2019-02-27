const { transformSync } = require('@babel/core')
const fs = require('fs')
const path = require('path')
const plugin = require('../src')

const fixture = path.resolve('./tests/fixtures/example.js')
const code = fs.readFileSync(fixture).toString()

it('works', () => {
  const result = transformSync(code, {
    plugins: [plugin],
    filename: fixture,
  })

  expect(result.code).toMatchSnapshot()
})
