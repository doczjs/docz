import { Entries, getFilesToMatch, matchFilesWithSrc } from '../src/lib/Entries'
import { getTestConfig } from '../src/test-utils'

describe('Entries', () => {
  test('get entries', async () => {
    const config = getTestConfig()
    const entries = new Entries(config)
    expect(entries).toBeTruthy()
  })

  test('get map of entries', async () => {
    const config = getTestConfig({
      src: '__fixtures__',
      files: '**/*.{mdx}',
    })
    const entries = new Entries(config)
    const map = await entries.get()
    expect(
      Object.keys(map).includes('__fixtures__/Alert/Alert.mdx')
    ).toBeTruthy()
  })

  test('with blank src and files', async () => {
    const config = getTestConfig({
      src: '',
      files: 'docz/**/*.{mdx}',
    })
    const files = getFilesToMatch(config)
    expect(matchFilesWithSrc(config)(files)[0]).toEqual('docz/**/*.{mdx}')
  })
  test('with src and files', async () => {
    const config = getTestConfig({
      src: '__fixtures__',
      files: '**/*.{mdx}',
    })
    const files = getFilesToMatch(config)
    expect(matchFilesWithSrc(config)(files)[0]).toEqual(
      '__fixtures__/**/*.{mdx}'
    )
  })
})
