import * as React from 'react'
import { SFC } from 'react'
import { Route } from 'react-router-dom'
import { DocObj } from 'docz'

import * as components from '../../components'
import { Container } from '../../components'

export const Doc: SFC<DocObj> = ({ id, route, component: Component }) => (
  <Route
    exact
    path={route}
    render={() => (
      <Container>
        <Component
          components={{
            h1: components.H1,
            h2: components.H2,
            h3: components.H3,
            table: components.Table,
            render: components.Render,
            tooltip: components.Tooltip,
            pre: components.Pre,
          }}
        />
      </Container>
    )}
  />
)
