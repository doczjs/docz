import { setArgs } from '../src/config/argv'
import { getBaseConfig } from '../src/config/docz'
describe('config.argv & config.docz', () => {
  test('works', () => {
    const yargs = {
      argv: {},
      option: jest.fn().mockImplementation((key, value) => {
        yargs.argv[value.alias ? value.alias : key] = value
        return yargs
      }),
    }
    const { argv } = setArgs(yargs)
    // expect(argv).toMatchInlineSnapshot(`undefined`)
    //@ts-ignore
    getBaseConfig(argv, {})
    // expect(c)
  })
})
