import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import { Docs } from 'docz-react'
import styled from 'react-emotion'

import { Doc } from './Doc'

export const View = () => (
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
)
