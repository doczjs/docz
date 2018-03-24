import React, { Fragment } from 'react'

import { Preview } from 'playgrodd'

export const View = () => (
  <Preview>
    {({ id, name, docDescription, sections }) => (
      <Fragment key={id}>
        <h2>{name}</h2>
        {docDescription && <p>{docDescription}</p>}
        {sections &&
          sections.length > 0 &&
          sections.map(section => (
            <Fragment key={section.id}>
              <h3>{section.title}</h3>
              <div>{section.render()}</div>
            </Fragment>
          ))}
      </Fragment>
    )}
  </Preview>
)
