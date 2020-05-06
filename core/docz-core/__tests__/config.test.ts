import * as path from 'path'
import { setArgs, Argv } from '../src/config/argv'
import { getBaseConfig } from '../src/config/docz'
import { getThemesDir } from '../src/config/paths'
import yargs, { Arguments } from 'yargs'

describe('config.argv & config.docz', () => {
  test('works', () => {
    const { argv } = setArgs(yargs)
    getBaseConfig((argv as unknown) as Arguments<Argv>, {})
  })
})

describe('getThemeDir', () => {
  test('returns src/ for default config', () => {
    const { argv } = setArgs(yargs)
    const config = getBaseConfig((argv as unknown) as Arguments<Argv>, {})

    expect(getThemesDir(config)).toBe(path.join(config.root, '/src'))
  })

  it('returns correct path for custom themesDir entry', () => {
    const { argv } = setArgs(yargs)
    const config = getBaseConfig((argv as unknown) as Arguments<Argv>, {
      themesDir: 'theme',
    })

    expect(getThemesDir(config)).toBe(path.join(config.root, '/theme'))
  })

  test('custom themesDir entries with trailing slashes are handled correctly', () => {
    const { argv } = setArgs(yargs)
    const config = getBaseConfig((argv as unknown) as Arguments<Argv>, {
      themesDir: 'theme/',
    })

    expect(getThemesDir(config)).toBe(path.join(config.root, '/theme'))
  })
})
