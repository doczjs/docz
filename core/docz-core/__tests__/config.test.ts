import * as path from 'path'
import { setArgs } from '../src/config/argv'
import { getBaseConfig } from '../src/config/docz'
import { getThemeDir } from '../src/config/paths'
import yargs from 'yargs'

describe('config.argv & config.docz', () => {
  test('works', () => {
    const { argv } = setArgs(yargs)
    // expect(argv).toMatchInlineSnapshot(`undefined`)
    //@ts-ignore
    getBaseConfig(argv, {})
    // expect(c)
  })
})

describe('getThemeDir', () => {
  test('returns src/ for default config', () => {
    const { argv } = setArgs(yargs)
    //@ts-ignore
    const config = getBaseConfig(argv, {})

    expect(getThemeDir(config)).toBe(path.join(config.root, '/src'))
  })

  test('returns correct path for custom themesDir entry', () => {
    const { argv } = setArgs(yargs)
    //@ts-ignore
    const config = getBaseConfig(argv, { themesDir: 'theme' })

    expect(getThemeDir(config)).toBe(path.join(config.root, '/theme'))
  })
})
