import { Config } from '../config/argv'
import * as paths from '../config/paths'
// let a: Config
export const createConfigStateInput = () => {
  return {
    title: 'test-tile',
    description: 'test-desc',
    menu: [{ name: 'menu-name' }],
    paths,
    native: undefined,
    themeConfig: undefined,
    separator: undefined,
    src: 'src/',
  } as unknown as Config
}
