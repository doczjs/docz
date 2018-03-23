import * as React from 'react'
import { Link } from 'react-router-dom'

import { createTheme, Playgrodd, Preview } from 'playgrodd'

export const Theme = createTheme(() => (
  <div>
    <h1>Default theme</h1>
    <ul>
      <li>
        <Link to="/src/Alert">Alert</Link>
      </li>
      <li>
        <Link to="/src/Button">Button</Link>
      </li>
    </ul>
    <Preview />
  </div>
))
