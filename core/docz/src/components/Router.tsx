import * as React from 'react'
import { SFC } from 'react'
import { HashRouter, BrowserRouter } from 'react-router-dom'
import { StaticRouterProps } from 'react-router'

declare var DOCZ_BASE_URL: string
declare var DOCZ_HASH_ROUTER: boolean

const BaseRouter: SFC<StaticRouterProps> = (props: any) =>
  Boolean(DOCZ_HASH_ROUTER) ? (
    <HashRouter {...props} />
  ) : (
    <BrowserRouter {...props} />
  )

export const Router: SFC = ({ children }) => {
  return <BaseRouter basename={DOCZ_BASE_URL}>{children}</BaseRouter>
}
