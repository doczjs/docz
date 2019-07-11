import * as headings from './Headings'

import { Code } from './Code'
import { Layout } from './Layout'
import { Playground } from './Playground'
import { Pre } from './Pre'
import { Props } from './Props'

export const componentsMap = {
  ...headings,
  code: Code,
  playground: Playground,
  pre: Pre,
  layout: Layout,
  props: Props,
}
