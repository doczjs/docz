import { getBaseConfig } from '../src/config/docz'
import * as paths from '../src/config/paths'
import * as fs from 'fs-extra'
import { setArgs } from '../src/config/argv'
import { getPattern, initial } from '../src/states/props'
import { Params } from '../src/lib/DataServer'
import yargs from 'yargs'

const mockedParams = (): Params => {
  let data: any = {}
  return {
    getState: () => data,
    setState: (key: string, value: string) => (data[key] = value),
  }
}

const mockedArgv = () => {
  const yargsArgs: any = {
    argv: {},
    option: jest.fn().mockImplementation((key, value) => {
      yargs.argv[value.alias ? value.alias : key] = value.default
      return yargs
    }),
  }
  const { argv } = setArgs(yargsArgs)
  return argv
}

describe('props', () => {
  const propsCache = '../.docz/.cache/propsParser.json'
  afterEach(() => {
    if (fs.existsSync(propsCache)) {
      fs.removeSync('../.docz/.cache')
    }
  })

  it('should set props from typescript files', async () => {
    const argv = mockedArgv()
    //@ts-ignore
    const config = { ...getBaseConfig(argv), paths, typescript: true }
    const pattern = getPattern(config)
    const data = initial(config, pattern)
    const params = mockedParams()
    await data(params)
    expect(params.getState().props.length).toBeGreaterThan(0)
  })
})
