import React, { Fragment } from 'react'
import { useComponents } from 'docz'
import { MDXProvider } from '@mdx-js/react'
import { propEq, get } from 'lodash/fp'

import { useDbQuery } from '../hooks/useDbQuery'
import Wrapper from '../wrapper'
import Theme from '../index'
import SEO from './Seo'

interface RouteProps {
  entry?: any
}

const Route: React.FunctionComponent<RouteProps> = ({
  children,
  entry,
  ...defaultProps
}) => {
  const components = useComponents()
  const NotFound = components.notFound
  const Layout = components.layout
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

const findEntry = (db, ctx) => {
  const isIndex = ctx.frontmatter.route === '/'
  const eqIndex = propEq('value.route', '/')
  if (!ctx.entry && isIndex) return db.entries.find(eqIndex)
  const filepath = get('entry.filepath', ctx)
  return db.entries.find(propEq('value.filepath', filepath))
}

interface LayoutProps {
  color?: string
}

const Layout: React.FunctionComponent<LayoutProps> = ({
  children,
  ...defaultProps
}) => {
  const { pageContext: ctx } = defaultProps
  const db = useDbQuery()
  const entry = findEntry(db, ctx)
  return (
    <Fragment>
      {entry && <SEO title={entry.value.name} />}
      <Theme db={db} currentEntry={entry}>
        <Route {...defaultProps} entry={entry}>
          {children}
        </Route>
      </Theme>
    </Fragment>
  )
}

export default Layout
