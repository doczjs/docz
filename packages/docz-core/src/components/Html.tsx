import * as React from 'react'
import { SFC } from 'react'

export interface HtmlProps {
  title: string
  description: string
}

export const Html: SFC<HtmlProps> = ({ title, description }) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <title>{title}</title>
    </head>
    <body>
      <div id="root" />
    </body>
  </html>
)
