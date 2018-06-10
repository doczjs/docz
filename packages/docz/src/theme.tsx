import * as React from 'react'
import { Fragment, SFC } from 'react'
import { ComponentType as CT } from 'react'
import { BrowserRouter } from 'react-router-dom'
import merge from 'deepmerge'

import { ComponentsMap } from './components/DocPreview'

declare var BASE_URL: string

export type MSXComponent = CT<{
  components: ComponentsMap
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
  settings: {
    [key: string]: any
  }
}

export interface ThemeConfig {
  [key: string]: any
}

export type EntryMap = Record<string, Entry>
export type ImportMap = Record<string, () => Promise<MSXImport>>

export interface DataContext {
  config: ThemeConfig
  entries: EntryMap
  imports: ImportMap
}

const initialContext: DataContext = {
  config: {},
  entries: {},
  imports: {},
}

export const dataContext = React.createContext(initialContext)

export interface ThemeProps extends DataContext {
  wrapper?: CT
  children(WrappedComponent: CT): JSX.Element
}

const DefaultWrapper: SFC = ({ children }) => <Fragment>{children}</Fragment>

export function theme(
  WrappedComponent: CT,
  defaultConfig?: ThemeConfig
): CT<ThemeProps> {
  const Theme: CT<ThemeProps> = ({
    wrapper: Wrapper = DefaultWrapper,
    entries,
    imports,
    config = {},
  }) => {
    const newConfig = merge(defaultConfig, config)
    const value = { entries, imports, config: newConfig }

    return (
      <dataContext.Provider value={value}>
        <BrowserRouter basename={BASE_URL}>
          <Wrapper>
            <WrappedComponent />
          </Wrapper>
        </BrowserRouter>
      </dataContext.Provider>
    )
  }

  Theme.displayName = 'DoczTheme'
  return Theme
}
