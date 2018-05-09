import React from 'react'
import { Route } from 'react-router-dom'
import { Docs } from 'docz'
import styled from 'react-emotion'

import { Doc } from './Doc'

const Wrapper = styled('div')`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

export const View = () => (
  <Wrapper>
    <Docs>
      {({ docs }) =>
        docs.map(doc => (
          <Route
            exact
            key={doc.id}
            path={doc.route}
            render={() => <Doc {...doc} />}
          />
        ))
      }
    </Docs>
  </Wrapper>
)
