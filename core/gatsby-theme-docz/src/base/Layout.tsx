import React from 'react'
import { useComponents } from 'docz'
import { MDXProvider } from '@mdx-js/react'
import { propEq, get } from 'lodash/fp'

import { useDbQuery } from '../hooks/useDbQuery'
import Wrapper from '../wrapper'
import Theme from '../index'
import SEO from './Seo'

interface Entry {
  id: string
  filepath: string
  fullpath: string
  link: string | null
  slug: string
  name: string
  route: string
  menu: string | null
  headings: unknown[]
  [key: string]: any
}

interface GatsbyPageContext {
  entry: Entry
  frontmatter: {
    route: string
  }
}

interface RouteProps {
  entry?: Entry
}
// type Entries = { key: string; value: Entry }[]

export interface DoczDB {
  currentEntry: Entry
  entries?: Entry[]
}

const Route: React.FunctionComponent<RouteProps> = ({
  children,
  entry,
  ...defaultProps
}) => {
  const components = useComponents()
  const NotFound = components.notFound ? components.notFound : () => null
  const Layout = components.layout ? components.layout : () => null
  const props = { ...defaultProps, doc: entry }
  if (!entry) return <NotFound />
  return (
    <MDXProvider components={components}>
      <Wrapper>
        <Layout {...props}>{children}</Layout>
      </Wrapper>
    </MDXProvider>
  )
}

const findEntry = (db: DoczDB, ctx: GatsbyPageContext) => {
  const isIndex = ctx.frontmatter.route === '/'
  const eqIndex = propEq('value.route', '/')
  const entries = db.entries || []
  if (!ctx.entry && isIndex) return entries.find(eqIndex)
  const filepath = get('entry.filepath', ctx)
  return entries.find(propEq('value.filepath', filepath))
}

interface LayoutProps {
  color?: string
  pageContext: GatsbyPageContext
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  ...defaultProps
}) => {
  const { pageContext: ctx } = defaultProps
  const db = useDbQuery()
  const entry = findEntry(db, ctx)
  if (!entry) return null
  return (
    <React.Fragment>
      {entry && <SEO title={entry.value.name} />}
      <Theme db={db} currentEntry={entry}>
        {
          (
            <Route {...defaultProps} entry={entry}>
              {children}
            </Route>
          ) as any
        }
      </Theme>
    </React.Fragment>
  )
}

export default Layout
