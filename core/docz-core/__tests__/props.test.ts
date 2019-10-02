import { getBaseConfig } from '../src/config/docz'
import * as paths from '../src/config/paths'
import { setArgs } from '../src/config/argv'
import { getPattern, initial } from '../src/states/props'
import { Params } from '../src/lib/DataServer'

const mockedParams = (): Params => {
  let data = {}
  return {
    getState: () => data,
    setState: (key: string, value: string) => (data[key] = value),
  }
}

const mockedArgv = () => {
  const yargs = {
    argv: {},
    option: jest.fn().mockImplementation((key, value) => {
      yargs.argv[value.alias ? value.alias : key] = value.default
      return yargs
    }),
  }
  const { argv } = setArgs(yargs)
  return argv
}

describe('props', () => {
  it('should set props', async () => {
    const argv = mockedArgv()
    //@ts-ignore
    const config = { ...getBaseConfig(argv), paths, typescript: true }
    const pattern = getPattern(config)
    const data = initial(config, pattern)
    const params = mockedParams()
    await data(params)
    expect(params.getState()).toBeTruthy()
  })
})
