import * as states from '../src/states/index'
import { createConfigStateInput } from '../src/test-utils/data-bank'
import { getBaseConfig } from '../src/config/docz'
import * as paths from '../src/config/paths'
import { Entries } from '../src/lib/Entries'
import { setArgs } from '../src/config/argv'

describe('states', () => {
  test('exports', () => {
    expect(states).toBeDefined()
    expect(typeof states.config).toEqual('function')
    expect(typeof states.entries).toEqual('function')
    expect(typeof states.props).toEqual('function')
  })
})

describe('states.config', () => {
  test('config returns valid state', () => {
    const state = states.config({})
    expect(typeof state.close).toEqual('function')
    expect(typeof state.start).toEqual('function')
    expect(state.id).toEqual('config')
    state.close()
  })
  test('config state writes config to state when started', async () => {
    const config = createConfigStateInput()
    const setState = jest.fn()
    const getState = jest.fn()
    const state = states.config(config)
    await state.start({ getState, setState })
    delete config.paths
    delete config.src
    expect(setState).toBeCalledWith('config', expect.objectContaining(config))
    state.close()
  })
})

describe('states.entries', () => {
  test('entries returns start-able state', async () => {
    const yargs = {
      argv: {},
      option: jest.fn().mockImplementation((key, value) => {
        yargs.argv[value.alias ? value.alias : key] = value.default
        return yargs
      }),
    }
    const { argv } = setArgs(yargs)
    //@ts-ignore
    const config = { ...getBaseConfig(argv), paths }
    const entries = new Entries(config)
    const state = states.entries(entries, config)
    const setState = jest.fn()
    const getState = jest.fn()
    await state.start({ getState, setState })
    expect(getState).toBeCalledWith()
    // expect(setState).toBeCalledWith('entries', [])
    state.close()
  })
})
