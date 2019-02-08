import * as React from 'react'
import { SFC, Component } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import importedComponent from 'react-imported-component'

import { Entry } from '../state'
import { ComponentsMap } from './DocPreview'
import { AsyncComponent } from './AsyncComponent'

export type Imports = Record<string, () => Promise<any>>
export async function loadFromImports(
  path: string,
  imports: Imports
): Promise<SFC<any>> {
  // tslint:disable-next-line
  const { default: Component, getInitialData } = await imports[path]()
  const ExportedComponent: SFC<any> = props => (
    <AsyncComponent
      {...props}
      as={Component || 'div'}
      getInitialData={getInitialData}
    />
  )

  return withMDXComponents(ExportedComponent)
}

export const loadRoute: any = (
  path: string,
  imports: Imports,
  LoadingComponent: any
) => {
  const opts: any = { LoadingComponent }
  return importedComponent(async () => loadFromImports(path, imports), opts)
}

interface AsyncRouteProps {
  asyncComponent: any
  components: ComponentsMap
  path: string
  entry: Entry
}

export class AsyncRoute extends Component<AsyncRouteProps> {
  public componentDidMount(): void {
    this.scrollToAnchor()
  }

  public render(): React.ReactNode {
    const {
      components,
      asyncComponent,
      path,
      entry,
      ...routeProps
    } = this.props

    const Page: any = components.page
    const Component: any = asyncComponent
    const props = { ...routeProps, doc: entry }

    return Page ? (
      <Page {...props}>
        <Component {...props} />
      </Page>
    ) : (
      <Component {...props} />
    )
  }

  private scrollToAnchor(): void {
    setTimeout(() => {
      if (typeof window !== 'undefined' && location.hash) {
        const id: string = location.hash.substring(1)
        const el: HTMLElement | null = document.getElementById(id)
        if (el) el.scrollIntoView()
      }
    })
  }
}
