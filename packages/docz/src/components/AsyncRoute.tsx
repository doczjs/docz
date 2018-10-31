import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import importedComponent from 'react-imported-component'

import { ImportMap, EntryMap } from '../state'
import { ComponentsMap } from './DocPreview'
import { AsyncComponent } from './AsyncComponent'

interface AsyncRouteProps {
  components: ComponentsMap
  path: string
  imports: ImportMap
  entries: EntryMap
}

export const AsyncRoute: SFC<AsyncRouteProps> = ({
  components,
  path,
  imports,
  entries,
  ...routeProps
}) => {
  const Page: any = components.page
  const LoadingComponent: any = components.loading
  const entry = entries && entries[path]
  const props = { ...routeProps, doc: entry }

  const loadImport = async () => {
    const { default: Component, getInitialData } = await imports[path]()
    const ExportedComponent: any = (props: any) => (
      <AsyncComponent
        {...props}
        as={Component}
        getInitialData={getInitialData}
      />
    )

    return ExportedComponent
  }

  const Component = withMDXComponents(
    importedComponent(loadImport, { LoadingComponent })
  )

  return Page ? (
    <Page {...props}>
      <Component {...props} />
    </Page>
  ) : (
    <Component {...props} />
  )
}
