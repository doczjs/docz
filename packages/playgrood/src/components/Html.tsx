import * as React from 'react'

import { IComponents } from '../utils/components'

export interface IHtmlProps {
  components: IComponents
}

export const Html: React.SFC<IHtmlProps> = ({ components }) => {
  const stringifiedComps = JSON.stringify(components)

  return (
    <html>
      <head>
        <title>playgrodd</title>
        <body>
          <div id="root" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__PLAYGRODD_COMPONENTS__ = ${stringifiedComps};`,
            }}
          />
          <script src="./index.jsx" />
        </body>
      </head>
    </html>
  )
}
