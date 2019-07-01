import * as headings from './Headings'

import { Layout } from './Layout'
import { Playground } from './Playground'
import { Pre } from './Pre'
import { Props } from './Props'

export const componentsMap = {
  ...headings,
  playground: Playground,
  pre: Pre,
  layout: Layout,
  props: Props,
}
