import * as React from 'react'
import { Component, ComponentType as CT } from 'react'
import { BrowserRouter } from 'react-router-dom'

declare var module: any

export type MSXComponent = CT<{
  components: { [key: string]: any }
}>

export interface MSXImport {
  default: MSXComponent
}

export interface Entry {
  id: string
  filepath: string
  slug: string
  route: string
  name: string
  menu: string | null
  order: number
}

export type EntryMap = Record<string, Entry>
export type ImportMap = Record<string, () => Promise<MSXImport>>

export interface Data {
  title?: string
  description?: string
  theme?: string
  entries?: EntryMap
}

export interface DataContext {
  imports: ImportMap
  data: Data
}

const initialContext: DataContext = {
  imports: {},
  data: {},
}

export const dataContext = React.createContext(initialContext)

export interface ThemeProps extends DataContext {
  wrapper: CT
  children(WrappedComponent: CT): JSX.Element
}

export function theme(WrappedComponent: CT): CT<ThemeProps> {
  return class Theme extends Component<ThemeProps, DataContext> {
    public state = initialContext

    public UNSAFE_componentWillReceiveProps(nextProps: ThemeProps): void {
      if (module.hot) {
        setImmediate(() => this.populateState(nextProps))
      }
    }

    public componentDidMount(): void {
      this.populateState(this.props)
    }

    public render(): JSX.Element {
      const { wrapper: Wrapper } = this.props

      return (
        <dataContext.Provider value={this.props}>
          <BrowserRouter>
            <Wrapper>
              <WrappedComponent />
            </Wrapper>
          </BrowserRouter>
        </dataContext.Provider>
      )
    }

    private populateState(props: ThemeProps): void {
      this.setState(() => ({
        imports: props.imports,
        data: props.data,
      }))
    }
  }
}
