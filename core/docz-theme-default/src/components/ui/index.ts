import { Playground } from './Playground'
import { Blockquote } from './Blockquote'
import { Editor } from './Editor'
import { H1 } from './H1'
import { H2 } from './H2'
import { H3 } from './H3'
import { H4 } from './H4'
import { H5 } from './H5'
import { H6 } from './H6'
import { Hr } from './Hr'
import { InlineCode } from './InlineCode'
import { Link } from './Link'
import { Loading } from './Loading'
import { NotFound } from './NotFound'
import { OrderedList } from './OrderedList'
import { Page } from './Page'
import { Paragraph } from './Paragraph'
import { Pre } from './Pre'
import { Props } from './Props'
import { Table } from './Table'
import { UnorderedList } from './UnorderedList'

export const components = {
  a: Link,
  blockquote: Blockquote,
  editor: Editor,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: Hr,
  inlineCode: InlineCode,
  loading: Loading,
  notFound: NotFound,
  ol: OrderedList,
  p: Paragraph,
  page: Page,
  playground: Playground,
  pre: Pre,
  props: Props,
  table: Table,
  ul: UnorderedList,
}
