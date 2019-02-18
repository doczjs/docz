import * as React from 'react'

const Playground = React.lazy(() => import('./Playground'))
export const AsyncPlayground: React.SFC<any> = props => (
  <React.Suspense fallback={null}>
    <Playground {...props} />
  </React.Suspense>
)
