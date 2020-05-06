import * as paths from '../config/paths'
import yargs, { Arguments } from 'yargs'
import { setArgs, Config, Argv } from '../config/argv'
import { Params } from '../lib/DataServer'
import { getBaseConfig } from '../config/docz'

export const mockedParams = (): Params => {
  let data: any = {}
  return {
    getState: () => data,
    setState: (key: string, value: string) => (data[key] = value),
  }
}

export const mockedArgv = (): Arguments<Argv> => {
  const yargsArgs: any = {
    argv: {},
    option: jest.fn().mockImplementation((key, value) => {
      yargs.argv[value.alias ? value.alias : key] = value.default
      return yargs
    }),
  }
  const { argv } = setArgs(yargsArgs)
  return (argv as unknown) as Arguments<Argv>
}

export const getTestConfig = (overrides?: Partial<Config>): Config => {
  const argv = mockedArgv()
  return {
    ...getBaseConfig(argv),
    paths,
    typescript: true,
    src: './__fixtures__',
    ...overrides,
  }
}
