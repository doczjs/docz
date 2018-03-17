import * as React from 'react'

import { IComponent } from '../utils/components'

export interface IHtmlProps {
  components: IComponent[]
}

export const Html: React.SFC<IHtmlProps> = ({ components }) => {
  const stringifiedComps = JSON.stringify(components)

  return (
    <html>
      <head>
        <title>playgrodd</title>
        <body>
          <div id="root" />
          <script src="./index.jsx" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__PLAYGRODD_COMPONENTS__ = ${stringifiedComps}`,
            }}
          />
        </body>
      </head>
    </html>
  )
}
