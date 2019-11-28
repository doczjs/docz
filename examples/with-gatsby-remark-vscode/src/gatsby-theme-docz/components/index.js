import * as headings from 'gatsby-theme-docz/src/components/Headings'
import { Layout } from 'gatsby-theme-docz/src/components/Layout'
import { Playground } from 'gatsby-theme-docz/src/components/Playground'
import { Props } from 'gatsby-theme-docz/src/components/Props'

export default {
  ...headings,
  playground: Playground,
  layout: Layout,
  props: Props,
}
