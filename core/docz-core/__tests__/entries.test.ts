import { Entries } from '../src/lib/Entries'
import { getTestConfig } from './utils'

describe('Entries', () => {
  test('get entries', async () => {
    const config = getTestConfig()
    const entries = new Entries(config)
    expect(entries).toBeTruthy()
  })
})
