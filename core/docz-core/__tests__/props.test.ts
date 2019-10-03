import * as fs from 'fs-extra'
import { getPattern, initial } from '../src/states/props'
import { readCacheFile } from '../src/utils/docgen/typescript'
import { getTestConfig, mockedParams } from './utils'

describe('props', () => {
  beforeEach(() => {
    if (fs.existsSync('./.docz/.cache/propsParser.json')) {
      fs.unlinkSync('./.docz/.cache/propsParser.json')
    }
  })

  describe('typescript', () => {
    test('should set props from typescript files', async () => {
      const config = getTestConfig()
      const pattern = getPattern(config)
      const data = initial(config, pattern)
      const params = mockedParams()
      await data(params)
      expect(params.getState().props.length).toBeGreaterThan(0)
    })

    test('should set correct key on parsed typescript files', async () => {
      const config = getTestConfig()
      const pattern = getPattern(config)
      const data = initial(config, pattern)
      const params = mockedParams()
      await data(params)
      const expectedFirstPropName = '__fixtures__/Label.tsx'
      const firstProp = params.getState().props[0]
      expect(firstProp.key).toEqual(expectedFirstPropName)
      expect(firstProp.value).toBeTruthy()
    })
  })

  describe('javascript', () => {
    test('should set correct key on parsed javascript files', async () => {
      const config = getTestConfig({ typescript: undefined })
      const pattern = getPattern(config)
      const data = initial(config, pattern)
      const params = mockedParams()
      await data(params)
      const expectedFirstPropName = '__fixtures__/Label.jsx'
      const firstProp = params.getState().props[0]
      expect(firstProp.key).toEqual(expectedFirstPropName)
      expect(firstProp.value).toBeTruthy()
    })

    test('should set props from javascript files', async () => {
      const config = getTestConfig({ typescript: undefined })
      const pattern = getPattern(config)
      const data = initial(config, pattern)
      const params = mockedParams()
      await data(params)
      expect(params.getState().props.length).toBeGreaterThan(0)
    })

    test('should have props on javascript files', async () => {
      const config = getTestConfig({ typescript: undefined })
      const pattern = getPattern(config)
      const data = initial(config, pattern)
      const params = mockedParams()
      await data(params)
      const firstProp = params.getState().props[0]
      expect(firstProp.value[0].props).toBeTruthy()
    })
  })

  describe('cache', () => {
    test('should have empty cache on start', () => {
      const cache = readCacheFile()
      expect(cache).toBeNull()
    })

    test('should set cache on loading props', async () => {
      const cache = readCacheFile()
      expect(cache).toBeNull()
      const config = getTestConfig()
      const pattern = getPattern(config)
      const data = initial(config, pattern)
      const params = mockedParams()
      await data(params)
      expect(readCacheFile()).not.toBeNull()
    })
  })
})
