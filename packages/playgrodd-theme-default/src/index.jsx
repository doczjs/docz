import * as React from 'react'
import { Link } from 'react-router-dom'

import { Playgrodd, Preview } from 'playgrodd'

export const App = () => (
  <Playgrodd>
    <ul>
      <li>
        <Link to="/src/Alert">Alert</Link>
      </li>
      <li>
        <Link to="/src/Button">Button</Link>
      </li>
    </ul>
    <Preview />
  </Playgrodd>
)
