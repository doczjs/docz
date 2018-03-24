import React from 'react'
import { Link } from 'react-router-dom'

import { Docs } from 'playgrodd'

export const List = () => (
  <Docs>
    {docs => (
      <ul>
        {docs.map(doc => (
          <li key={doc.id}>
            <Link to={doc.route}>{doc.name}</Link>
          </li>
        ))}
      </ul>
    )}
  </Docs>
)
