import * as React from 'react'
import { Subscribe } from 'unstated'
import { Route } from 'react-router-dom'

import { Doc } from '../documents'
import { IComponent } from '../utils/components'
import { DocumentsContainer } from '../documents/container'

const components = __PLAYGRODD_COMPONENTS__
const loadDocument = (doc: Doc) => {
  const { route }: IComponent = components[doc.getName()]
  const sections = doc.getSections()

  return (
    <Route
      exact
      key={route}
      path={route}
      render={() =>
        sections.map(({ id, title, render: Component }) => (
          <React.Fragment key={id}>
            {title && <h2>{title}</h2>}
            <Component />
          </React.Fragment>
        ))
      }
    />
  )
}

export const Preview: React.SFC = () => (
  <Subscribe to={[DocumentsContainer]}>
    {({ state }) => state.documents.map(loadDocument)}
  </Subscribe>
)
