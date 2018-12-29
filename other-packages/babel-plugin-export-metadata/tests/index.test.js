import { transformSync } from '@babel/core'
import * as fs from 'fs'
import * as path from 'path'
import plugin from '../src'

const fixture = path.resolve('./tests/fixtures/example.js')
const code = fs.readFileSync(fixture).toString()

it('works', () => {
  const result = transformSync(code, {
    plugins: [plugin],
    filename: fixture,
  })

  expect(result!.code).toMatchSnapshot()
})
