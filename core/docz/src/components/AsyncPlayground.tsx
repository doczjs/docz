import * as React from 'react'
import loadable from '@loadable/component'

const BasePlayground = loadable(() => import('./Playground'))
export const Playground: React.SFC<any> = props =>
  typeof window !== 'undefined' ? (
    <React.Suspense fallback={null}>
      <BasePlayground {...props} />
    </React.Suspense>
  ) : null
